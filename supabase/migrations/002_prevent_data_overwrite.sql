-- Migration pour empêcher l'écrasement accidentel des données
-- Créée le 02/02/2026 après l'incident de perte de données

-- 1. Ajouter une colonne de tracking pour savoir si un post a été modifié
ALTER TABLE posts 
ADD COLUMN IF NOT EXISTS modified_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS is_customized BOOLEAN DEFAULT FALSE;

-- 2. Créer une fonction trigger qui marque un post comme customisé
-- dès qu'il est modifié (image uploadée, texte changé, etc.)
CREATE OR REPLACE FUNCTION mark_post_as_customized()
RETURNS TRIGGER AS $$
BEGIN
  -- Si le contenu a changé (sauf published status)
  IF OLD.content IS DISTINCT FROM NEW.content THEN
    -- Vérifier si c'est une vraie modification (pas juste published)
    IF (OLD.content - 'published') IS DISTINCT FROM (NEW.content - 'published') THEN
      NEW.is_customized := TRUE;
      NEW.modified_at := NOW();
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Créer le trigger
DROP TRIGGER IF EXISTS trigger_mark_customized ON posts;
CREATE TRIGGER trigger_mark_customized
  BEFORE UPDATE ON posts
  FOR EACH ROW
  EXECUTE FUNCTION mark_post_as_customized();

-- 4. Marquer tous les posts existants avec des images Supabase comme customisés
UPDATE posts
SET is_customized = TRUE
WHERE content->>'imageUrl' LIKE '%supabase.co/storage%';

-- 5. Créer une vue pour faciliter le monitoring
CREATE OR REPLACE VIEW posts_status AS
SELECT 
  id,
  content->>'title' as title,
  content->>'date' as date,
  content->>'imageUrl' as image_url,
  CASE 
    WHEN content->>'imageUrl' LIKE '%picsum.photos%' THEN 'placeholder'
    WHEN content->>'imageUrl' LIKE '%supabase.co/storage%' THEN 'supabase'
    WHEN content->>'imageUrl' LIKE 'data:%' THEN 'base64'
    ELSE 'other'
  END as image_type,
  (content->>'published')::boolean as published,
  is_customized,
  modified_at
FROM posts
ORDER BY id;

-- 6. Créer une fonction de protection contre l'écrasement
CREATE OR REPLACE FUNCTION prevent_overwrite_customized()
RETURNS TRIGGER AS $$
BEGIN
  -- Si le post est marqué comme customisé
  IF OLD.is_customized = TRUE THEN
    -- On ne permet que la modification du statut published
    IF (OLD.content - 'published') IS DISTINCT FROM (NEW.content - 'published') THEN
      RAISE EXCEPTION 'Cannot overwrite customized post %. Use manual update only.', OLD.id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Créer le trigger de protection (désactivé par défaut, à activer manuellement si besoin)
-- DROP TRIGGER IF EXISTS trigger_prevent_overwrite ON posts;
-- CREATE TRIGGER trigger_prevent_overwrite
--   BEFORE UPDATE ON posts
--   FOR EACH ROW
--   EXECUTE FUNCTION prevent_overwrite_customized();

-- 8. Créer une fonction pour réinitialiser un post (si vraiment nécessaire)
CREATE OR REPLACE FUNCTION reset_post_to_template(post_id TEXT)
RETURNS VOID AS $$
BEGIN
  UPDATE posts
  SET is_customized = FALSE
  WHERE id = post_id;
  
  RAISE NOTICE 'Post % can now be updated from template', post_id;
END;
$$ LANGUAGE plpgsql;

-- 9. Ajouter des commentaires pour la documentation
COMMENT ON COLUMN posts.is_customized IS 'TRUE si le post a été modifié manuellement (image uploadée, texte changé). Protège contre l''écrasement par constants.ts';
COMMENT ON COLUMN posts.modified_at IS 'Date de dernière modification du post';
COMMENT ON VIEW posts_status IS 'Vue pour monitorer l''état des posts (type d''image, customisation, etc.)';
COMMENT ON FUNCTION prevent_overwrite_customized IS 'Empêche l''écrasement des posts customisés. Trigger désactivé par défaut.';
COMMENT ON FUNCTION reset_post_to_template IS 'Permet de réinitialiser un post pour qu''il puisse être mis à jour depuis constants.ts';

-- 10. Créer un index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_posts_customized ON posts(is_customized);
CREATE INDEX IF NOT EXISTS idx_posts_modified_at ON posts(modified_at);
