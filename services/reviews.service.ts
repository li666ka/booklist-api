import { Review, ReviewRepository } from '../models/review.model';
import { ReviewDto } from '../controllers/reviews/dto/review.dto';
import { ReviewFiltersDtoParsed } from '../types/dto-parsed.types';
import ReviewsDataValidator from '../validators/data/reviews.data.validator';
import { User, UserRepository } from '../models/user.model';
import { Book, BookRepository } from '../models/book.model';
import { Author, AuthorRepository } from '../models/author.model';
import { CreateReviewDto } from '../controllers/reviews/dto/create-review.dto';
import { UpdateReviewDto } from '../controllers/reviews/dto/update-review.dto';
import UsersService from './users.service';
import BooksService from './books.service';
import AuthorsService from './authors.service';

class ReviewsService {
	public static find(
		reviewsFiltersDto: ReviewFiltersDtoParsed | undefined
	): ReviewDto[] {
		if (reviewsFiltersDto) ReviewsDataValidator.validateGettingAll(reviewsFiltersDto);

		let reviews: Review[] = ReviewRepository.cache;

		if (reviewsFiltersDto) {
			const { bookId, userId, scoreMin, scoreMax } = reviewsFiltersDto;

			if (userId) reviews = this.filterByUserId(userId, reviews);
			if (bookId) reviews = this.filterByBookId(bookId, reviews);
			if (scoreMin) reviews = this.filterByMinScore(scoreMin, reviews);
			if (scoreMax) reviews = this.filterByMaxScore(scoreMax, reviews);
		}

		const reviewsDto: ReviewDto[] = [];

		for (const review of reviews) {
			const reviewDto: ReviewDto = this.parseToDto(review);
			reviewsDto.push(reviewDto);
		}

		return reviewsDto;
	}

	public static findOne(userId: number, bookId: number): ReviewDto {
		const review: Review = ReviewsDataValidator.validateGetting(userId, bookId);
		return this.parseToDto(review);
	}

	public static getByIds(userId: number, bookId: number): Review | undefined {
		return ReviewRepository.cache.find(
			(review) => review.user_id === userId && review.book_id === bookId
		);
	}

	public static async create(
		userId: number,
		bookId: number,
		createReviewDto: CreateReviewDto
	): Promise<ReviewDto> {
		await ReviewsDataValidator.validateCreating(userId, bookId, createReviewDto);

		const { score, comment } = createReviewDto;
		await ReviewRepository.create(userId, bookId, score, comment);

		const newReview = (await ReviewRepository.get(userId, bookId)) as Review;

		await ReviewRepository.store();
		return this.parseToDto(newReview);
	}

	public static async update(
		userId: number,
		bookId: number,
		updateReviewDto: UpdateReviewDto
	) {
		let review = await ReviewsDataValidator.validateUpdating(
			bookId,
			userId,
			updateReviewDto
		);

		const { score, comment } = updateReviewDto;
		if (score) {
			await this.updateScore(score, review);
			review = (await ReviewRepository.get(bookId, userId)) as Review;
		}
		if (comment) {
			await this.updateComment(comment, review);
			review = (await ReviewRepository.get(bookId, userId)) as Review;
		}
		await ReviewRepository.store();
	}

	public static async delete(userId: number, bookId: number) {
		await ReviewsDataValidator.validateGetting(userId, bookId);
		await ReviewRepository.delete(userId, bookId);
		await ReviewRepository.store();
	}

	public static parseToDto(review: Review): ReviewDto {
		console.log(review);
		const { user_id, book_id, score, comment, created_at } = review;

		const user = UsersService.getById(user_id) as User;
		const book = BooksService.getById(book_id) as Book;
		const author = AuthorsService.getById(book.author_id) as Author;

		return {
			user: { id: user.id, username: user.username },
			book: {
				id: book.id,
				title: book.title,
				author: { id: author.id, fullName: author.full_name },
			},
			score: score,
			comment: comment,
			createdAt: created_at,
		};
	}

	private static filterByUserId(userId: number, reviews: Review[]): Review[] {
		return reviews.filter((review) => review.user_id === userId);
	}
	private static filterByBookId(bookId: number, reviews: Review[]): Review[] {
		return reviews.filter((review) => review.book_id === bookId);
	}
	private static filterByMinScore(scoreMin: number, reviews: Review[]): Review[] {
		return reviews.filter((review) => review.score >= scoreMin);
	}
	private static filterByMaxScore(scoreMax: number, reviews: Review[]): Review[] {
		return reviews.filter((review) => review.score <= scoreMax);
	}
	private static async updateScore(score: number, review: Review) {
		await ReviewRepository.update(
			score,
			review.comment,
			review.user_id,
			review.book_id
		);
	}
	private static async updateComment(comment: string | null, review: Review) {
		await ReviewRepository.update(
			review.score,
			comment,
			review.user_id,
			review.book_id
		);
	}
}

export default ReviewsService;
