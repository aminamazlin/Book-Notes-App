
--One to one--
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title TEXT UNIQUE NOT NULL,
  cover_isbn VARCHAR(15) UNIQUE,
  notes TEXT
);

CREATE TABLE reviews (
  book_id INT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  review_date DATE DEFAULT CURRENT_DATE,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT
);

--Data--
INSERT INTO books
(title, cover_isbn, notes)
VALUES ('Psycho-cybertnetics', '0399176136', 
'The self image: your key to a better life
Discovering the success mechanism within you
Imagination: the first key to your success mechanism
Dehypnotize yourself from false beliefs
How to utilize the power of rational thinking
Relax and let your success mechanism work for you
You can acquire the habit of happiness
Ingredients of the success-type personality and how to acquire them
The failure mechanism: how to make it work for you instead of against you
How to remove emotional scars, or how to give yourself an emotional face lift
How to unlock your real personality
Do-it-yourself tranquilizers that bring peace of mind
How to turn a crisis into a creative opportunity
How to get "that winning feeling"
More years of life and more life in your years.' )

INSERT INTO reviews 
(book_id, rating, review_text)
VALUES (1, 5, 'Psycho-Cybernetics by Dr. Maxwell Maltz is a seminal self-help book that emphasizes the power of self-image in 
achieving success and happiness. Drawing from his experiences as a plastic surgeon, Maltz argues that changing one''s self-perception
 can lead to significant personal transformation. The book offers practical techniques and exercises for building confidence, 
 overcoming negative habits, and fostering a success-oriented mindset. By viewing the mind as a machine that can be programmed, 
 Maltz provides readers with tools to reprogram their subconscious for a more fulfilling and successful life.')


--Join tables--
SELECT * 
FROM books
JOIN reviews
ON books.id = book_id