/* Books shown on books.html. Add one object per book; chapters are read on the same page (books.html?book=<slug>&ch=<n>).
   Each text field is bilingual: { en: '...', te: '...' }. Chapter body = array of paragraphs (bilingual objects).
   Optional per chapter: verse {en, te}, video {id, start} (YouTube id + start seconds). Optional per book: pdf (file in /books/). */
window.HSPH_BOOKS = [
  // Example shape (keep commented until the first book is ready):
  // {
  //   slug: 'my-first-book',
  //   title: { en: 'Book Title', te: 'పుస్తకం పేరు' },
  //   author: { en: 'Author Name', te: 'రచయిత పేరు' },
  //   blurb: { en: 'One or two lines about the book.', te: 'పుస్తకం గురించి ఒకటి రెండు మాటలు.' },
  //   year: 2026,
  //   pdf: 'books/my-first-book.pdf',
  //   chapters: [
  //     { title: { en: 'Chapter 1', te: 'అధ్యాయం 1' },
  //       verse: { en: '"The Lord is my shepherd" – Psalm 23:1', te: '"యెహోవా నా కాపరి" – కీర్తన 23:1' },
  //       body: [ { en: 'Paragraph…', te: 'పేరా…' } ],
  //       video: { id: 'YOUTUBE_ID', start: 0 } }
  //   ]
  // }
];
