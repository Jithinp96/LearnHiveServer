// async submitAssessment(
    //   assessmentId: string,
    //   studentId: string,
    //   answers: { questionIndex: number; selectedOption: number }[]
    // ): Promise<IStudentAssessment> {
    //   const assessment = await this.repository.getAssessmentById(assessmentId);
    //   if (!assessment) {
    //     throw new Error('Assessment not found');
    //   }
  
    //   const score = this.calculateScore(answers, assessment);
      
    //   const studentAssessment: IStudentAssessment = {
    //     assessmentId,
    //     studentId,
    //     score,
    //     answers: answers.map((answer) => ({
    //       questionIndex: answer.questionIndex,
    //       selectedOption: answer.selectedOption,
    //       isCorrect: assessment.questions[answer.questionIndex].correctOption === answer.selectedOption
    //     })),
    //     completed: true,
    //     startedAt: new Date(),
    //     completedAt: new Date()
    //   };
  
    //   return await this.repository.submitStudentAssessment(studentAssessment);
    // }
  
    // private calculateScore(
    //   answers: { questionIndex: number; selectedOption: number }[],
    //   assessment: IAssessment
    // ): number {
    //   let totalCorrect = 0;
    //   answers.forEach(answer => {
    //     if (assessment.questions[answer.questionIndex].correctOption === answer.selectedOption) {
    //       totalCorrect += assessment.questions[answer.questionIndex].marks;
    //     }
    //   });
    //   return (totalCorrect / assessment.questions.length) * 100;
    // }
