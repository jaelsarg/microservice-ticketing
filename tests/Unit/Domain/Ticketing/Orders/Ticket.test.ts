import { MovieInfo, Seat, Ticket, VisitorType, VisitorTypeState } from '@/Domain/Ticketing/Orders/mod.ts';
import { AgeRating, Genre, Money, MovieDuration, MovieId, MovieTitle, PosterUrl } from '@/Domain/Ticketing/Movies/mod.ts';
import { assertEquals } from '@std/assert';

Deno.test('[Unit] - Ticket - create - valid input - returns aggregate with value objects', () => {
    // Arrange
    const movieInfo = MovieInfo.create(
        MovieId.create(),
        MovieTitle.create("Title of movie"),
        MovieDuration.create(123),
        [ Genre.create("Animation"), Genre.create("Family") ],
        PosterUrl.create("http://posterurl.jpg"),
        AgeRating.create(12),
        Money.create(0.15 * 123)
    );
    const seat = Seat.create(12, VisitorType.create(VisitorTypeState.Standard));
    const room = 'Blue Room';
    const showTime = new Date('2026-05-15T19:00:00Z');

    // Act
    const ticket = Ticket.create(movieInfo, seat, room, showTime);

    // Assert
    assertEquals(ticket.movieInfo.movieId instanceof MovieId, true);
    assertEquals(ticket.movieInfo.title.value, movieInfo.title.value);
    assertEquals(ticket.movieInfo.duration.value, movieInfo.duration.value);
    assertEquals(ticket.movieInfo.genres.values, movieInfo.genres.values);
    assertEquals(ticket.movieInfo.posterUrl.value, movieInfo.posterUrl.value);
    assertEquals(ticket.movieInfo.ageRating.value, movieInfo.ageRating.value);
    assertEquals(ticket.movieInfo.price.value, movieInfo.price.value);
    assertEquals(ticket.price.value, movieInfo.price.value);
});

Deno.test('[Unit] - Ticket - create - valid input; discounted - returns aggregate with value objects', () => {
    // Arrange
    const movieInfo = MovieInfo.create(
        MovieId.create(),
        MovieTitle.create("Title of movie"),
        MovieDuration.create(123),
        [ Genre.create("Animation"), Genre.create("Family") ],
        PosterUrl.create("http://posterurl.jpg"),
        AgeRating.create(12),
        Money.create(0.15 * 123)
    );
    const seat = Seat.create(12, VisitorType.create(VisitorTypeState.Discounted));
    const room = 'Blue Room';
    const showTime = new Date('2026-05-15T19:00:00Z');

    // Act
    const ticket = Ticket.create(movieInfo, seat, room, showTime);

    // Assert
    assertEquals(ticket.movieInfo.movieId instanceof MovieId, true);
    assertEquals(ticket.movieInfo.title.value, movieInfo.title.value);
    assertEquals(ticket.movieInfo.duration.value, movieInfo.duration.value);
    assertEquals(ticket.movieInfo.genres.values, movieInfo.genres.values);
    assertEquals(ticket.movieInfo.posterUrl.value, movieInfo.posterUrl.value);
    assertEquals(ticket.movieInfo.ageRating.value, movieInfo.ageRating.value);
    assertEquals(ticket.movieInfo.price.value, movieInfo.price.value);
    assertEquals(ticket.price.value, movieInfo.price.value * 0.9);
});

Deno.test('[Unit] - Ticket - getters - returns correct values', () => {
    // Arrange
    const movieInfo = MovieInfo.create(
        MovieId.create(),
        MovieTitle.create("Title of movie"),
        MovieDuration.create(123),
        [ Genre.create("Animation"), Genre.create("Family") ],
        PosterUrl.create("http://posterurl.jpg"),
        AgeRating.create(12),
        Money.create(0.15 * 123)
    );
    const seat = Seat.create(12, VisitorType.create(VisitorTypeState.Standard));
    const room = 'Blue Room';
    const showTime = new Date('2026-05-15T19:00:00Z');

    // Act
    const ticket = Ticket.create(movieInfo, seat, room, showTime);

    // Assert
    assertEquals(ticket.movieInfo, movieInfo);
    assertEquals(ticket.seat, seat);
    assertEquals(ticket.room, room);
    assertEquals(ticket.showTime, showTime);
    assertEquals(ticket.price.value, movieInfo.price.value);
});