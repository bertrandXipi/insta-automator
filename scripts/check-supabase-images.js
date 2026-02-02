// Script à exécuter dans la console du navigateur (F12)
// pour vérifier l'état des images dans Supabase

(async function checkSupabaseImages() {
  console.log('🔍 Vérification des images Supabase...\n');
  
  const SUPABASE_URL = "https://xczeyrugggausivlyfjb.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhjemV5cnVnZ2dhdXNpdmx5ZmpiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ5MzUzNzUsImV4cCI6MjA4MDUxMTM3NX0.p16MYP29bIbY-qv7Zmg_-TMMLpT1UsRmkV-gW_WRq4A";
  
  try {
    // Récupérer tous les posts de décembre-janvier
    const response = await fetch(`${SUPABASE_URL}/rest/v1/posts?select=id,content&order=id`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Filtrer décembre-janvier (p1-p30 et c1-c6)
    const decJanPosts = data.filter(row => {
      const id = row.id;
      if (id.startsWith('p')) {
        const num = parseInt(id.replace('p', ''));
        return num >= 1 && num <= 30;
      }
      if (id.startsWith('c')) {
        const num = parseInt(id.replace('c', ''));
        return num >= 1 && num <= 6;
      }
      return false;
    });
    
    console.log(`📊 Total posts décembre-janvier: ${decJanPosts.length}\n`);
    
    // Analyser les images
    let placeholderCount = 0;
    let supabaseCount = 0;
    let base64Count = 0;
    let otherCount = 0;
    
    const results = [];
    
    decJanPosts.forEach(row => {
      const post = row.content;
      const imageUrl = post.imageUrl || '';
      
      let type = 'autre';
      if (imageUrl.includes('picsum.photos')) {
        type = 'placeholder';
        placeholderCount++;
      } else if (imageUrl.includes('supabase.co/storage')) {
        type = 'supabase';
        supabaseCount++;
      } else if (imageUrl.startsWith('data:')) {
        type = 'base64';
        base64Count++;
      } else {
        otherCount++;
      }
      
      results.push({
        id: post.id,
        date: post.date,
        title: post.title,
        type: type,
        imageUrl: imageUrl.substring(0, 80) + (imageUrl.length > 80 ? '...' : '')
      });
    });
    
    // Afficher les stats
    console.log('📈 STATISTIQUES:');
    console.log(`   ❌ Placeholder (picsum): ${placeholderCount}`);
    console.log(`   ✅ Supabase Storage: ${supabaseCount}`);
    console.log(`   📦 Base64: ${base64Count}`);
    console.log(`   ❓ Autre: ${otherCount}\n`);
    
    // Afficher les posts avec placeholder
    if (placeholderCount > 0) {
      console.log('⚠️  POSTS AVEC PLACEHOLDER (à corriger):');
      results
        .filter(r => r.type === 'placeholder')
        .forEach(r => {
          console.log(`   ${r.id} (${r.date}) - ${r.title}`);
        });
      console.log('');
    }
    
    // Afficher les posts OK
    if (supabaseCount > 0) {
      console.log('✅ POSTS AVEC VRAIES IMAGES:');
      results
        .filter(r => r.type === 'supabase')
        .forEach(r => {
          console.log(`   ${r.id} (${r.date}) - ${r.title}`);
        });
      console.log('');
    }
    
    // Afficher le tableau complet
    console.log('📋 DÉTAIL COMPLET:');
    console.table(results);
    
    // Vérifier le Storage
    console.log('\n🗂️  Vérification du Storage...');
    const storageResponse = await fetch(`${SUPABASE_URL}/storage/v1/object/list/posts-images`, {
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      }
    });
    
    if (storageResponse.ok) {
      const storageFiles = await storageResponse.json();
      console.log(`   📁 Fichiers dans Storage: ${storageFiles.length}`);
      if (storageFiles.length > 0) {
        console.log('   Fichiers disponibles:');
        storageFiles.forEach(file => {
          const url = `${SUPABASE_URL}/storage/v1/object/public/posts-images/${file.name}`;
          console.log(`      - ${file.name} (${(file.metadata?.size / 1024).toFixed(2)} KB)`);
          console.log(`        URL: ${url}`);
        });
      }
    } else {
      console.log('   ⚠️  Impossible d\'accéder au Storage');
    }
    
    console.log('\n✅ Vérification terminée');
    
  } catch (error) {
    console.error('❌ Erreur:', error);
  }
})();
