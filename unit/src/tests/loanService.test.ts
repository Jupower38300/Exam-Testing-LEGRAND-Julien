import { describe, it, expect, beforeEach, vi } from "vitest";
import { LoanService } from "../LoanService";
import { Book } from "../Book";

describe("LoanService (unit)", () => {
  let service: LoanService;

  beforeEach(() => {
    service = new LoanService();
  });

  it("calculateDueDate should return correct due date for standard user", () => {
    const borrowDate = new Date("2025-06-01");
    const due = service.calculateDueDate(borrowDate, "standard");
    expect(due.toISOString()).toBe(new Date("2025-06-15").toISOString());
  });

  it("calculateDueDate should return correct due date for premium user", () => {
    const borrowDate = new Date("2025-06-01");
    const due = service.calculateDueDate(borrowDate, "premium");
    expect(due.toISOString()).toBe(new Date("2025-07-01").toISOString());
  });

  it("calculateDueDate should return correct due date for employee", () => {
    const borrowDate = new Date("2025-06-01");
    const due = service.calculateDueDate(borrowDate, "employee");
    expect(due.toISOString()).toBe(new Date("2025-07-31").toISOString());
  });

  it("calculatePenalty should return 0 when dueDate is undefined", () => {
    const book = new Book("b1", "Test", "Author");
    const penalty = service.calculatePenalty(book, new Date());
    expect(penalty).toBe(0);
  });

  it("calculatePenalty should return 0 if returned on or before due date", () => {
    const book = new Book("b1", "Test", "Author");
    book.dueDate = new Date("2025-06-10");
    const returnDate = new Date("2025-06-10");
    const penalty = service.calculatePenalty(book, returnDate);
    expect(penalty).toBe(0);
  });

  it("calculatePenalty should compute penalty correctly if returned late", () => {
    const book = new Book("b1", "Test", "Author");
    book.dueDate = new Date("2025-06-10");
    const returnDate = new Date("2025-06-13"); // 3 jours de retard
    const penalty = service.calculatePenalty(book, returnDate);
    expect(penalty).toBe(1.5);
  });

  it("getBorrowedBooks should return empty when no books", () => {
    expect(service.getBorrowedBooks()).toEqual([]);
  });

  it("getAvailableBooks should return empty when no books", () => {
    expect(service.getAvailableBooks()).toEqual([]);
  });

  it("getUserLoans should return empty when no books", () => {
    expect(service.getUserLoans("user1")).toEqual([]);
  });

  it("getOverdueBooks should return empty when no overdue books", () => {
    expect(service.getOverdueBooks(new Date())).toEqual([]);
  });
});
