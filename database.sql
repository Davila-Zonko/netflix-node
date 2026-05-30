-- ═══════════════════════════════════════════════════
--  Netflix Clone (Node.js) – Schema & Seed Data
--  Run:  mysql -u root -p < database.sql
-- ═══════════════════════════════════════════════════

CREATE DATABASE IF NOT EXISTS netflix_clone
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE netflix_clone;

CREATE TABLE IF NOT EXISTS users (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  plan ENUM('basic','standard','premium') NOT NULL DEFAULT 'standard',
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS movies (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  genre VARCHAR(255),
  release_year SMALLINT UNSIGNED,
  duration SMALLINT UNSIGNED,
  rating DECIMAL(3,1) DEFAULT 0.0,
  thumbnail VARCHAR(512),
  banner VARCHAR(512),
  video_url VARCHAR(512),
  cast_members TEXT,
  director VARCHAR(255),
  type ENUM('movie','series') NOT NULL DEFAULT 'movie',
  featured TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_type(type), INDEX idx_featured(featured), INDEX idx_rating(rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS user_list (
  user_id INT UNSIGNED NOT NULL,
  movie_id INT UNSIGNED NOT NULL,
  added_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS watch_history (
  user_id INT UNSIGNED NOT NULL,
  movie_id INT UNSIGNED NOT NULL,
  watched_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, movie_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movie_id) REFERENCES movies(id) ON DELETE CASCADE,
  INDEX idx_watched(watched_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- admin@netflix.com / admin123  |  user@netflix.com / password
INSERT INTO users (name,email,password,plan,role) VALUES
('Admin','admin@netflix.com','$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewYpR1uGk5T3eYFG','premium','admin'),
('Demo User','user@netflix.com','$2a$12$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi','standard','user');

INSERT INTO movies (title,description,genre,release_year,duration,rating,thumbnail,banner,video_url,cast_members,director,type,featured) VALUES
('Stranger Things','When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces, and one strange little girl.','Drama,Sci-Fi,Horror',2016,50,8.7,'https://image.tmdb.org/t/p/w500/49WJfeN0moxb9IPfGn8AIqMGskD.jpg','https://image.tmdb.org/t/p/original/56v2KjBlU4XaOv9rVYEQypROD7P.jpg','https://archive.org/download/StrangerThingsTrailer/Stranger_Things_Trailer.mp4','Millie Bobby Brown, Finn Wolfhard, David Harbour, Winona Ryder','The Duffer Brothers','series',1),
('The Dark Knight','When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological tests of his ability to fight injustice.','Action,Crime,Drama',2008,152,9.0,'https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg','https://image.tmdb.org/t/p/original/hkBaDkMWbLaf8B1lsWsKX7Ew3Xq.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4','Christian Bale, Heath Ledger, Aaron Eckhart, Michael Caine','Christopher Nolan','movie',0),
('Inception','A thief who steals corporate secrets through dream-sharing technology is given the task of planting an idea into the mind of a C.E.O.','Action,Sci-Fi,Thriller',2010,148,8.8,'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg','https://image.tmdb.org/t/p/original/s3TBrRGB1iav7gFOCNx3H31MoES.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerEscapes.mp4','Leonardo DiCaprio, Joseph Gordon-Levitt, Elliot Page, Tom Hardy','Christopher Nolan','movie',0),
('Breaking Bad','A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing methamphetamine to secure his family future.','Crime,Drama,Thriller',2008,47,9.5,'https://image.tmdb.org/t/p/w500/ggFHVNu6YYI5L9pCfOacjizRGt.jpg','https://image.tmdb.org/t/p/original/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerFun.mp4','Bryan Cranston, Aaron Paul, Anna Gunn, Dean Norris','Vince Gilligan','series',0),
('The Crown','Follows the political rivalries and romance of Queen Elizabeth II reign and the events that shaped the second half of the twentieth century.','Drama,History',2016,58,8.6,'https://image.tmdb.org/t/p/w500/1M876KPjulVwppEpldhdc8V4o68.jpg','https://image.tmdb.org/t/p/original/2Fp4gP0N2Wd0p2i3HsTBBRfS0VJ.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerJoyrides.mp4','Claire Foy, Olivia Colman, Imelda Staunton, Matt Smith','Peter Morgan','series',0),
('Interstellar','A team of explorers travel through a wormhole in space in an attempt to ensure humanity survival.','Adventure,Drama,Sci-Fi',2014,169,8.6,'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg','https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4','Matthew McConaughey, Anne Hathaway, Jessica Chastain, Michael Caine','Christopher Nolan','movie',0),
('The Witcher','Geralt of Rivia, a solitary monster hunter, struggles to find his place in a world where people often prove more wicked than beasts.','Action,Adventure,Fantasy',2019,60,8.2,'https://image.tmdb.org/t/p/w500/7vjaCdMw15FEbXyLQTVa04Ldrcn.jpg','https://image.tmdb.org/t/p/original/jBJWaqoSCiARWtfV0GlqHrcdidd.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4','Henry Cavill, Anya Chalotra, Freya Allan, Joey Batey','Lauren Schmidt Hissrich','series',1),
('Parasite','Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan.','Comedy,Drama,Thriller',2019,132,8.5,'https://image.tmdb.org/t/p/w500/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg','https://image.tmdb.org/t/p/original/TU9NIjwzjoKPwQHoHshkFcQUCG.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerMeals.mp4','Song Kang-ho, Lee Sun-kyun, Cho Yeo-jeong, Choi Woo-shik','Bong Joon-ho','movie',0),
('Money Heist','An unusual group of robbers attempt to carry out the most perfect robbery in Spanish history stealing 2.4 billion euros from the Royal Mint.','Action,Crime,Thriller',2017,50,8.3,'https://image.tmdb.org/t/p/w500/reEMJA1uzscCbkpeRJeTT2bjqUp.jpg','https://image.tmdb.org/t/p/original/gFk9v5bxEPL15gjYoEKSFDK5PvL.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/Sintel.mp4','Alvaro Morte, Ursula Corbero, Itziar Ituno, Pedro Alonso','Alex Pina','series',0),
('The Shawshank Redemption','Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.','Drama',1994,142,9.3,'https://image.tmdb.org/t/p/w500/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg','https://image.tmdb.org/t/p/original/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/TearsOfSteel.mp4','Tim Robbins, Morgan Freeman, Bob Gunton, William Sadler','Frank Darabont','movie',0),
('Ozark','A financial advisor drags his family from Chicago to the Missouri Ozarks, where he must launder money to appease a drug boss.','Crime,Drama,Thriller',2017,60,8.4,'https://image.tmdb.org/t/p/w500/pCGyPVrI9Fzw6rE1Pvi4BIXF6ET.jpg','https://image.tmdb.org/t/p/original/mHall9APKFp8t3C5qkXBQzCBpR4.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4','Jason Bateman, Laura Linney, Julia Garner, Sofia Hublitz','Bill Dubuque','series',0),
('Avengers: Endgame','After the devastating events of Infinity War, the Avengers assemble once more to reverse Thanos actions and restore balance to the universe.','Action,Adventure,Sci-Fi',2019,181,8.4,'https://image.tmdb.org/t/p/w500/or06FN3Dka5tukK1e9sl16pB3iy.jpg','https://image.tmdb.org/t/p/original/7RyHsO4yDXtBv1zUU3mTpHeQ0d5.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerEscapes.mp4','Robert Downey Jr., Chris Evans, Mark Ruffalo, Chris Hemsworth','Anthony Russo, Joe Russo','movie',0),
('Squid Game','Hundreds of cash-strapped players accept a strange invitation to compete in childrens games, with a tempting prize at the end but lethal stakes if they lose.','Action,Drama,Mystery',2021,60,8.0,'https://image.tmdb.org/t/p/w500/dDlEmu3EZ0Pgg93K2SVNLCjCSvE.jpg','https://image.tmdb.org/t/p/original/qw3J9cNeLioOLoR68WX7z79aCdK.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerFun.mp4','Lee Jung-jae, Park Hae-soo, Wi Ha-jun, Jung Ho-yeon','Hwang Dong-hyuk','series',1),
('The Godfather','The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.','Crime,Drama',1972,175,9.2,'https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsLeSThe7D4H.jpg','https://image.tmdb.org/t/p/original/tmU7GeKVybMWFbE09MKRP4lz3Ry.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4','Marlon Brando, Al Pacino, James Caan, Richard Castellano','Francis Ford Coppola','movie',0),
('Black Mirror','An anthology series exploring a twisted high-tech multiverse where humanitys greatest innovations and darkest instincts collide.','Drama,Sci-Fi,Thriller',2011,60,8.8,'https://image.tmdb.org/t/p/w500/7PRddO7z7mcPi21nZTCMGShAyy1.jpg','https://image.tmdb.org/t/p/original/lHe8iwGFriE6n3uy5Q2nBWfXnkF.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4','Bryce Dallas Howard, Anthony Mackie, Jon Hamm','Charlie Brooker','series',0),
('Spider-Man: No Way Home','With Spider-Mans identity revealed, Peter asks Doctor Strange for help. When a spell goes wrong, dangerous foes from other worlds appear.','Action,Adventure,Fantasy',2021,148,8.3,'https://image.tmdb.org/t/p/w500/1g0dhYtq4irTY1GPXvft6k4YLjm.jpg','https://image.tmdb.org/t/p/original/iQFcwSGbZXMkeyKrxbPnwnRo5fl.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerJoyrides.mp4','Tom Holland, Zendaya, Benedict Cumberbatch, Jamie Foxx','Jon Watts','movie',0),
('Bridgerton','Wealthy and regal, the Bridgerton family is a force to be reckoned with in the competitive world of Regency London marriage market.','Drama,Romance',2020,60,7.3,'https://image.tmdb.org/t/p/w500/luoKpgVwi1E5nQsi7W0UuKHu2Rq.jpg','https://image.tmdb.org/t/p/original/mMZRKb3NVTjyla9vS4oDkMQ1Wuw.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/Sintel.mp4','Rege-Jean Page, Phoebe Dynevor, Jonathan Bailey, Adjoa Andoh','Chris Van Dusen','series',0),
('Dune','Paul Atreides, a gifted young man born into a great destiny, must travel to the most dangerous planet in the universe to ensure the future of his family.','Adventure,Drama,Sci-Fi',2021,155,8.0,'https://image.tmdb.org/t/p/w500/d5NXSklpcvkDPeGQA0IoEboXmGY.jpg','https://image.tmdb.org/t/p/original/iopYFB1b6Bh7FWZh3onQhph1sih.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerMeals.mp4','Timothee Chalamet, Zendaya, Rebecca Ferguson, Oscar Isaac','Denis Villeneuve','movie',0),
('The Office','A mockumentary on a group of typical office workers, where the workday consists of ego clashes, inappropriate behavior, and tedium.','Comedy',2005,22,9.0,'https://image.tmdb.org/t/p/w500/qWnJzyZhyy74gjpSjIXWmuk0ifX.jpg','https://image.tmdb.org/t/p/original/pPSiWlPRxqwCBxC3sVBmHbBrMxT.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/TearsOfSteel.mp4','Steve Carell, John Krasinski, Jenna Fischer, Rainn Wilson','Greg Daniels','series',0),
('Pulp Fiction','The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.','Crime,Drama',1994,154,8.9,'https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg','https://image.tmdb.org/t/p/original/suaEOtk1N1sgg2MTM7oZd2cfVp3.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4','John Travolta, Uma Thurman, Samuel L. Jackson, Bruce Willis','Quentin Tarantino','movie',0),
('Narcos','A chronicled look at the criminal exploits of Colombian drug lord Pablo Escobar as well as the many drug kingpins who plagued the world in the 1980s.','Biography,Crime,Drama',2015,49,8.8,'https://image.tmdb.org/t/p/w500/rTmal9fDbwh5F0waol2hq35U4ah.jpg','https://image.tmdb.org/t/p/original/sbbrq9wMsciQPLPTbFhE5s4mGqN.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerEscapes.mp4','Wagner Moura, Pedro Pascal, Boyd Holbrook, Joanna Christie','Chris Brancato','series',0),
('The Matrix','A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.','Action,Sci-Fi',1999,136,8.7,'https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg','https://image.tmdb.org/t/p/original/Yc9q4QunKVSalBKFMFBGiKUXdQL.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4','Keanu Reeves, Laurence Fishburne, Carrie-Anne Moss, Hugo Weaving','Lana Wachowski, Lilly Wachowski','movie',0),
('Mindhunter','In the late 1970s two FBI agents expand criminal science by delving into the psychology of murder and getting inside the minds of serial killers.','Crime,Drama,Thriller',2017,60,8.6,'https://image.tmdb.org/t/p/w500/dlnO3DRG63A5bBxpJMDoiN8k7aP.jpg','https://image.tmdb.org/t/p/original/zIqnaqe9ub5Y5uDOPzVmfVTTMpv.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4','Jonathan Groff, Holt McCallany, Anna Torv, Hannah Gross','David Fincher','series',0),
('Gladiator','A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery.','Action,Adventure,Drama',2000,155,8.5,'https://image.tmdb.org/t/p/w500/ty8TGRuvJLPUmAR1H1nRIsgwvim.jpg','https://image.tmdb.org/t/p/original/6WBIzCgmDCYrqh64yDREGeDk9d3.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerFun.mp4','Russell Crowe, Joaquin Phoenix, Connie Nielsen, Oliver Reed','Ridley Scott','movie',0),
('Peaky Blinders','A gangster family epic set in 1919 Birmingham, centred on a gang who sew razor blades in the peaks of their caps and their fierce boss Tommy Shelby.','Crime,Drama',2013,60,8.8,'https://image.tmdb.org/t/p/w500/vUUqzWa2LnHIVqkaKVn3nyfVsa0.jpg','https://image.tmdb.org/t/p/original/wiE9doxiLwq3WierbyZl9CKtJPK.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/Sintel.mp4','Cillian Murphy, Helen McCrory, Paul Anderson, Tom Hardy','Steven Knight','series',1),
('Forrest Gump','The presidencies of Kennedy and Johnson, the Vietnam War, the Watergate scandal and other historical events unfold through the perspective of an Alabama man.','Comedy,Drama,Romance',1994,142,8.8,'https://image.tmdb.org/t/p/w500/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg','https://image.tmdb.org/t/p/original/ghgfzbEV7kbpbi1O8ejgl7Hpj60.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/TearsOfSteel.mp4','Tom Hanks, Robin Wright, Gary Sinise, Sally Field','Robert Zemeckis','movie',0),
('Dark','A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.','Crime,Drama,Mystery',2017,60,8.8,'https://image.tmdb.org/t/p/w500/apbrbWs5eHouzm9GrBPFzO3BgQB.jpg','https://image.tmdb.org/t/p/original/namehqQygspbqTBZWWzDFi9TKZo.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerJoyrides.mp4','Louis Hofmann, Oliver Masucci, Karoline Eichhorn, Lisa Vicari','Baran bo Odar','series',0),
('John Wick','An ex-hitman comes out of retirement to track down the gangsters who killed his dog and took everything from him.','Action,Crime,Thriller',2014,101,7.4,'https://image.tmdb.org/t/p/w500/fZPSd91llCMi5rLveRSXKqGYCMl.jpg','https://image.tmdb.org/t/p/original/mSUqQhqNgPTpAo1yfOkL8TdHoum.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4','Keanu Reeves, Michael Nyqvist, Alfie Allen, Willem Dafoe','Chad Stahelski','movie',0),
('The Queens Gambit','Orphaned at nine, chess prodigy Beth Harmon discovers a passion for the game while strategizing her way through the glamour of 1960s culture.','Drama',2020,60,8.6,'https://image.tmdb.org/t/p/w500/zU0htwkhNvBQdVSIKB9s6hgVeFK.jpg','https://image.tmdb.org/t/p/original/34OGjFEbHj0E3lE2w0iTUVqqwb2.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerFun.mp4','Anya Taylor-Joy, Bill Camp, Moses Ingram, Thomas Brodie-Sangster','Scott Frank','series',0),
('Wednesday','Follows Wednesday Addams years as a student at Nevermore Academy, where she attempts to master her psychic ability and solve the mystery that embroiled her parents.','Comedy,Fantasy,Mystery',2022,48,8.1,'https://image.tmdb.org/t/p/w500/9PFonBhy4cQy7hjrnPlvi2R9dMp.jpg','https://image.tmdb.org/t/p/original/iA3yLCzKlxqPNS5YIuRtxrFEqTj.jpg','https://commondatastorage.googleapis.com/gtv-videos-library/sample/Sintel.mp4','Jenna Ortega, Hunter Doohan, Melissa Barrera, Percy Hynes White','Tim Burton','series',1);
