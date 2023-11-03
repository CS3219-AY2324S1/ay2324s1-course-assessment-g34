const { expect } = require("chai");
const sinon = require("sinon");
const questionController = require("../controllers/questionController");
const questionService = require("../services/questionService");

describe("Question Controller", () => {
  describe("getAllQuestions", () => {
    it("should return questions when getAllQuestionsService succeeds", async () => {
      const mockQuestions = [
        {
          title: "Sample Question 1",
          categories: ["Category A", "Category B"],
          difficulty: "Easy",
          link: "https://example.com/question1",
          description: "Description for Sample Question 1",
        },
        {
          title: "Sample Question 2",
          categories: ["Category B", "Category C"],
          difficulty: "Medium",
          link: "https://example.com/question2",
          description: "Description for Sample Question 2",
        },
        {
          title: "Sample Question 3",
          categories: ["Category A", "Category D"],
          difficulty: "Hard",
          link: "https://example.com/question3",
          description: "Description for Sample Question 3",
        },
      ];
      const req = {};
      const res = {
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      };

      sinon
        .stub(questionService, "getAllQuestionsService")
        .resolves(mockQuestions);

      await questionController.getAllQuestions(req, res);

      expect(res.json.calledWith(mockQuestions)).to.be.true;

      sinon.restore();
    });

    it("should handle errors when getAllQuestionsService fails", async () => {
      const errorMessage = "An error occurred";
      const req = {};
      const res = {
        json: sinon.stub(),
        status: sinon.stub().returnsThis(),
      };

      sinon
        .stub(questionService, "getAllQuestionsService")
        .rejects(new Error(errorMessage));

      await questionController.getAllQuestions(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(res.json.calledWith({ message: errorMessage })).to.be.true;

      sinon.restore();
    });
  });
});

describe("getQuestionById", () => {
  it("should return a question by ID when getQuestionByIdService succeeds", async () => {
    const mockQuestion = {
      title: "Sample Question",
      categories: ["Category A"],
      difficulty: "Medium",
      link: "https://example.com/question",
      description: "Description for Sample Question",
    };

    const req = {
      params: { id: "123" },
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "getQuestionByIdService")
      .withArgs("123")
      .resolves(mockQuestion);

    await questionController.getQuestionById(req, res);

    expect(res.json.calledWith(mockQuestion)).to.be.true;

    sinon.restore();
  });

  it("should return an error response when getQuestionByIdService fails", async () => {
    const errorMessage = "Failed to get question by ID";

    const req = {
      params: { id: "123" },
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "getQuestionByIdService")
      .withArgs("123")
      .rejects(new Error(errorMessage));

    await questionController.getQuestionById(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ message: errorMessage })).to.be.true;

    sinon.restore();
  });
});

describe("getRandomQuestion", () => {
  it("should return a random question when filterQuestionsService succeeds", async () => {
    const mockQuestions = [
      {
        title: "Sample Question 1",
        categories: ["Category A", "Category B"],
        difficulty: "Easy",
        link: "https://example.com/question1",
        description: "Description for Sample Question 1",
      },
      {
        title: "Sample Question 2",
        categories: ["Category B", "Category C"],
        difficulty: "Medium",
        link: "https://example.com/question2",
        description: "Description for Sample Question 2",
      },
    ];

    const req = {
      query: { difficulty: "Medium", categories: ["Category B"] },
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "filterQuestionsService")
      .withArgs("Medium", ["Category B"])
      .resolves(mockQuestions);

    const randomIndex = 0; // Index of the question to be returned

    const randomStub = sinon
      .stub(Math, "random")
      .returns(randomIndex / mockQuestions.length);

    await questionController.getRandomQuestion(req, res);

    expect(res.json.calledWith(mockQuestions[randomIndex])).to.be.true;

    sinon.restore();
  });

  it('should return a "Not Found" response when no questions match the criteria', async () => {
    const req = {
      query: { difficulty: "Hard", categories: ["Category X"] },
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "filterQuestionsService")
      .withArgs("Hard", ["Category X"])
      .resolves([]);

    await questionController.getRandomQuestion(req, res);

    expect(res.status.calledWith(404)).to.be.true;
    expect(
      res.json.calledWith({
        message: "No questions found with the specified criteria",
      })
    ).to.be.true;

    sinon.restore();
  });

  it("should return an error response when filterQuestionsService fails", async () => {
    const errorMessage = "Failed to filter questions";

    const req = {
      query: { difficulty: "Medium", categories: ["Category B"] },
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "filterQuestionsService")
      .withArgs("Medium", ["Category B"])
      .rejects(new Error(errorMessage));

    await questionController.getRandomQuestion(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ error: "Error fetching random question" })).to
      .be.true;

    sinon.restore();
  });
});

describe("filterQuestions", () => {
  it("should return filtered questions when filterQuestionsService succeeds", async () => {
    const mockFilteredQuestions = [
      {
        title: "Sample Question 1",
        categories: ["Category A", "Category B"],
        difficulty: "Easy",
        link: "https://example.com/question1",
        description: "Description for Sample Question 1",
      },
      {
        title: "Sample Question 2",
        categories: ["Category B", "Category C"],
        difficulty: "Medium",
        link: "https://example.com/question2",
        description: "Description for Sample Question 2",
      },
    ];

    const req = {
      query: { difficulty: "Medium", categories: ["Category B"] },
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "filterQuestionsService")
      .withArgs("Medium", ["Category B"])
      .resolves(mockFilteredQuestions);

    await questionController.filterQuestions(req, res);

    expect(res.json.calledWith(mockFilteredQuestions)).to.be.true;

    sinon.restore();
  });

  it('should return a "No questions found" response when no questions match the criteria', async () => {
    const req = {
      query: { difficulty: "Hard", categories: ["Category X"] },
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "filterQuestionsService")
      .withArgs("Hard", ["Category X"])
      .resolves([]);

    await questionController.filterQuestions(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(
      res.json.calledWith({
        message: "No questions found with the specified criteria",
      })
    ).to.be.true;

    sinon.restore();
  });

  it("should return an error response when filterQuestionsService fails", async () => {
    const errorMessage = "Failed to filter questions";

    const req = {
      query: { difficulty: "Medium", categories: ["Category B"] },
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "filterQuestionsService")
      .withArgs("Medium", ["Category B"])
      .rejects(new Error(errorMessage));

    await questionController.filterQuestions(req, res);

    expect(res.status.calledWith(500)).to.be.true;
    expect(res.json.calledWith({ error: "Error fetching filtered questions" }))
      .to.be.true;

    sinon.restore();
  });
});

describe("createQuestion", () => {
  it("should return the created question when createQuestionService succeeds", async () => {
    const mockQuestion = {
      title: "Sample Question",
      categories: ["Category A", "Category B"],
      difficulty: "Easy",
      link: "https://example.com/question",
      description: "Description for Sample Question",
    };

    const req = {
      body: mockQuestion,
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "createQuestionService")
      .withArgs(
        mockQuestion.title,
        mockQuestion.categories,
        mockQuestion.difficulty,
        mockQuestion.link,
        mockQuestion.description
      )
      .resolves(mockQuestion);

    await questionController.createQuestion(req, res);

    expect(res.status.calledWith(200)).to.be.true;
    expect(res.json.calledWith(mockQuestion)).to.be.true;

    sinon.restore();
  });

  it("should return an error response when createQuestionService fails", async () => {
    const errorMessage = "Failed to create question";

    const req = {
      body: {
        title: "Sample Question",
        difficulty: "Easy",
      },
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "createQuestionService")
      .rejects(new Error(errorMessage));

    await questionController.createQuestion(req, res);

    expect(res.json.calledWith({ message: errorMessage })).to.be.true;

    sinon.restore();
  });
});

describe("updateQuestion", () => {
  it("should return the updated question when updateQuestionService succeeds", async () => {
    const mockQuestion = {
      title: "Sample Question",
      categories: ["Category A", "Category B"],
      difficulty: "Easy",
      link: "https://example.com/question",
      description: "Description for Sample Question",
    };

    const req = {
      params: { id: "123" },
      body: mockQuestion,
    };

    const res = {
      json: sinon.stub(),
    };

    sinon
      .stub(questionService, "updateQuestionService")
      .withArgs("123", mockQuestion)
      .resolves(mockQuestion);

    await questionController.updateQuestion(req, res);

    expect(res.json.calledWith(mockQuestion)).to.be.true;

    sinon.restore();
  });

  it("should return an error response when updateQuestionService fails", async () => {
    const errorMessage = "Failed to update question";

    const req = {
      params: { id: "123" },
      body: {
        title: "Sample Question",
        difficulty: "Easy",
      },
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "updateQuestionService")
      .rejects(new Error(errorMessage));

    await questionController.updateQuestion(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: errorMessage })).to.be.true;

    sinon.restore();
  });
});

describe("deleteQuestion", () => {
  it("should return a success message when deleteQuestionService succeeds", async () => {
    const mockDeletedQuestion = {
      title: "Sample Question",
    };

    const req = {
      params: { id: "123" },
    };

    const res = {
      send: sinon.stub(),
    };

    sinon
      .stub(questionService, "deleteQuestionService")
      .withArgs("123")
      .resolves(mockDeletedQuestion);

    await questionController.deleteQuestion(req, res);

    expect(
      res.send.calledWith(
        `Document with ${mockDeletedQuestion.title} has been deleted..`
      )
    ).to.be.true;

    sinon.restore();
  });

  it("should return an error response when deleteQuestionService fails", async () => {
    const errorMessage = "Failed to delete question";

    const req = {
      params: { id: "123" },
    };

    const res = {
      json: sinon.stub(),
      status: sinon.stub().returnsThis(),
    };

    sinon
      .stub(questionService, "deleteQuestionService")
      .rejects(new Error(errorMessage));

    await questionController.deleteQuestion(req, res);

    expect(res.status.calledWith(400)).to.be.true;
    expect(res.json.calledWith({ message: errorMessage })).to.be.true;

    sinon.restore();
  });
});