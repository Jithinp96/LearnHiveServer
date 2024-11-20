"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssessmentController = void 0;
const AssessmentRepository_1 = require("../../infrastructure/repositories/AssessmentRepository");
const HttpStatusEnum_1 = require("../../shared/enums/HttpStatusEnum");
const CreateAssessmentUseCase_1 = require("../../application/useCases/assessment/CreateAssessmentUseCase");
const FetchAssessmentByTutorUseCase_1 = require("../../application/useCases/assessment/FetchAssessmentByTutorUseCase");
const FetchAssessmentsForStudentUseCase_1 = require("../../application/useCases/assessment/FetchAssessmentsForStudentUseCase");
const FetchAssessmentByIdUseCase_1 = require("../../application/useCases/assessment/FetchAssessmentByIdUseCase");
const SubmitStudentAssessmentUseCase_1 = require("../../application/useCases/assessment/SubmitStudentAssessmentUseCase");
const StudentAssessmentRepository_1 = require("../../infrastructure/repositories/StudentAssessmentRepository");
const FetchAssessmentResultUseCase_1 = require("../../application/useCases/assessment/FetchAssessmentResultUseCase");
class AssessmentController {
    constructor() {
        this.createAssessment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Reached create assessment controller");
            try {
                const tutorId = req.userId;
                if (!tutorId) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ error: 'Unauthorized' });
                    return;
                }
                const assessment = yield this._createAssessmentUseCase.execute(req.body, tutorId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.CREATED).json(assessment);
            }
            catch (error) {
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to create assessment' });
            }
        });
        this.fetchAssessmentsByTutor = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Reached fetchAssessmentsByTutor controller");
            try {
                const tutorId = req.userId;
                if (!tutorId) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ error: 'Unauthorized' });
                    return;
                }
                const assessments = yield this._fetchAssessmentByTutorUseCase.execute(tutorId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(assessments);
            }
            catch (error) {
                console.error("Error fetching assessments by tutor:", error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch assessments' });
            }
        });
        this.fetchAssessmentsForStudent = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Reached fetchAssessmentsForStudent controller");
            try {
                const studentId = req.userId;
                if (!studentId) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.UNAUTHORIZED).json({ error: 'Unauthorized' });
                    return;
                }
                const assessments = yield this._fetchAssessmentsForStudentUseCase.execute(studentId);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(assessments);
            }
            catch (error) {
                console.error("Error fetching assessments for student:", error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch assessments for student' });
            }
        });
        this.fetchAssessmentById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            console.log("Reached fetchAssessmentById controller");
            try {
                const { assessmentId } = req.params;
                console.log("assessmentId from fetch assessment by id controller: ", assessmentId);
                if (!assessmentId) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.BAD_REQUEST).json({ error: 'Assessment ID is required' });
                    return;
                }
                const assessment = yield this._fetchAssessmentByIdUseCase.execute(assessmentId);
                if (!assessment) {
                    res.status(HttpStatusEnum_1.HttpStatusEnum.NOT_FOUND).json({ error: 'Assessment not found' });
                    return;
                }
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(assessment);
            }
            catch (error) {
                console.error("Error fetching assessment details:", error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to fetch assessment details' });
            }
        });
        this.submitAssessment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.userId;
                if (!studentId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                const { assessmentId } = req.params;
                const { responses } = req.body;
                const submissionData = {
                    studentId,
                    assessmentId,
                    responses
                };
                const submission = yield this._submitStudentAssessmentUseCase.execute(submissionData);
                res.status(HttpStatusEnum_1.HttpStatusEnum.OK).json(submission);
            }
            catch (error) {
                console.error("Error in submitting assessment:", error);
                res.status(HttpStatusEnum_1.HttpStatusEnum.INTERNAL_SERVER_ERROR).json({ error: 'Failed to submit assessment' });
            }
        });
        this.fetchAssessmentResultById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const studentId = req.userId;
                if (!studentId) {
                    res.status(401).json({ error: 'Unauthorized' });
                    return;
                }
                const { assessmentId } = req.params;
                const assessmentResult = this._fetchAssessmentResultByIdUseCase.execute(assessmentId);
                if (!assessmentResult) {
                    return res.status(404).json({ error: 'Assessment result not found' });
                }
                res.json(assessmentResult);
            }
            catch (error) {
                console.error("Error fetching assessment result:", error);
                res.status(500).json({ error: 'Failed to fetch assessment result' });
            }
        });
        const studentAssessmentRepo = new StudentAssessmentRepository_1.StudentAssessmentRepository();
        const assessmentRepo = new AssessmentRepository_1.AssessmentRepository();
        this._createAssessmentUseCase = new CreateAssessmentUseCase_1.CreateAssessmentUseCase(assessmentRepo);
        this._fetchAssessmentByTutorUseCase = new FetchAssessmentByTutorUseCase_1.FetchAssessmentsByTutorUseCase(assessmentRepo);
        this._fetchAssessmentsForStudentUseCase = new FetchAssessmentsForStudentUseCase_1.FetchAssessmentsForStudentUseCase(assessmentRepo);
        this._fetchAssessmentByIdUseCase = new FetchAssessmentByIdUseCase_1.FetchAssessmentByIdUseCase(assessmentRepo);
        this._submitStudentAssessmentUseCase = new SubmitStudentAssessmentUseCase_1.SubmitStudentAssessmentUseCase(assessmentRepo, studentAssessmentRepo);
        this._fetchAssessmentResultByIdUseCase = new FetchAssessmentResultUseCase_1.FetchAssessmentResultByIdUseCase(studentAssessmentRepo);
    }
}
exports.AssessmentController = AssessmentController;
