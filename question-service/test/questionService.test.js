const { expect } = require("chai");
const sinon = require("sinon");
const Question = require("../models/model");
const questionService = require("../services/questionService");

describe("questionService", () => {
  describe("getAllQuestionsService", () => {
    it("should return a list of questions sorted by title", async () => {
      const expectedQuestions = [
        { title: "Question A" },
        { title: "Question B" },
        { title: "Question C" },
      ];

      const findStub = sinon.stub(Question, "find");
      const sortStub = sinon.stub().resolves(expectedQuestions);
      findStub.returns({ sort: sortStub });

      const result = await questionService.getAllQuestionsService();

      findStub.restore();

      expect(result).to.deep.equal(expectedQuestions);
    });
  });

  describe("getQuestionByIdService", () => {
    it("should return a question by its ID", async () => {
      const questionId = "1234567890";
      const question = { _id: questionId, title: "Sample Question" };

      const QuestionMock = sinon.mock(Question);
      QuestionMock.expects("findById").withArgs(questionId).resolves(question);

      const result = await questionService.getQuestionByIdService(questionId);

      QuestionMock.verify();
      QuestionMock.restore();

      expect(result).to.deep.equal(question);
    });
  });

  describe("filterQuestionsService", () => {
    it("should filter questions based on difficulty and categories when both are provided", async () => {
      const difficulty = "Easy";
      const categories = ["Category A", "Category B"];

      const filter = {
        difficulty,
        categories,
      };

      const expectedQuestions = [
        { title: "Question 1" },
        { title: "Question 2" },
      ];

      const findStub = sinon.stub(Question, "find");
      findStub.withArgs(filter).resolves(expectedQuestions);

      const result = await questionService.filterQuestionsService(
        difficulty,
        categories
      );

      expect(result).to.deep.equal(expectedQuestions);

      sinon.assert.calledWith(findStub, filter);
      findStub.restore();
    });

    it("should filter questions based on difficulty when categories are not provided", async () => {
      const difficulty = "Easy";

      const filter = {
        difficulty,
      };

      const expectedQuestions = [
        { title: "Question 3" },
        { title: "Question 4" },
      ];

      const findStub = sinon.stub(Question, "find");
      findStub.withArgs(filter).resolves(expectedQuestions);

      const result = await questionService.filterQuestionsService(
        difficulty,
        null
      );

      expect(result).to.deep.equal(expectedQuestions);

      sinon.assert.calledWith(findStub, filter);
      findStub.restore();
    });

    it("should filter questions based on categories when difficulty is not provided", async () => {
      const categories = ["Category A", "Category B"];

      const filter = {
        categories,
      };

      const expectedQuestions = [
        { title: "Question 5" },
        { title: "Question 6" },
      ];

      const findStub = sinon.stub(Question, "find");
      findStub.withArgs(filter).resolves(expectedQuestions);

      const result = await questionService.filterQuestionsService(
        null,
        categories
      );

      expect(result).to.deep.equal(expectedQuestions);

      sinon.assert.calledWith(findStub, filter);
      findStub.restore();
    });
  });


  describe("createQuestionService", () => {
    it("should create and save a new question", async () => {
      const title = "Sample Question";
      const categories = ["Category A", "Category B"];
      const difficulty = "Easy";
      const link = "https://example.com/question";
      const description = "Sample question description";

      // Create a stub for the Question model's save method
      const saveStub = sinon.stub(Question.prototype, "save");
      const expectedQuestion = new Question({
        title,
        categories,
        difficulty,
        link,
        description,
      });
      saveStub.resolves(expectedQuestion);

      // Call the createQuestionService function and await the result
      const result = await questionService.createQuestionService(
        title,
        categories,
        difficulty,
        link,
        description
      );

      // Assertions
      expect(result).to.deep.equal(expectedQuestion);

      // Restore the stub
      sinon.restore();
    });
  });

  describe("updateQuestionService", () => {
    it("should update a question by ID", async () => {
      const id = "1234567890";
      const updatedData = { title: "Updated Question" };

      const findByIdAndUpdateStub = sinon.stub(Question, "findByIdAndUpdate");
      findByIdAndUpdateStub
        .withArgs(id, updatedData, { new: true })
        .resolves(updatedData);

      const result = await questionService.updateQuestionService(
        id,
        updatedData
      );

      expect(result).to.deep.equal(updatedData);

      sinon.assert.calledWith(findByIdAndUpdateStub, id, updatedData, {
        new: true,
      });
      findByIdAndUpdateStub.restore();
    });
  });

  describe("deleteQuestionService", () => {
    it("should delete a question by ID", async () => {
      const id = "1234567890";
      const deletedQuestion = { title: "Deleted Question" };

      const findByIdAndDeleteStub = sinon.stub(Question, "findByIdAndDelete");
      findByIdAndDeleteStub.withArgs(id).resolves(deletedQuestion);

      const result = await questionService.deleteQuestionService(id);

      expect(result).to.deep.equal(deletedQuestion);

      sinon.assert.calledWith(findByIdAndDeleteStub, id);
      findByIdAndDeleteStub.restore();
    });
  });
});
