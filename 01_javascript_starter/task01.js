const averageGrade = (person) => {
    const { grades } = person;
    if (!grades) {
        return 0;
    }
    const result = (
        grades
            .map(i => i.score)
            .reduce((acc, grade) => grade ? grade + acc : acc)
    ) / grades.length;
    return result.toFixed(2);
}


averageGrade({
   name: 'Chill Student', grades: [
       {
           name: 'Math',
           score: 1.3421425343,
       },
       {
           name: 'Science',
           score: 5
       },
       {
           name: 'Invalid Name',
           score: null
       },
       {
           name: 'Invalid Subject',
           score: undefined
       },
       {
           name: 'Biology',
           score: 10
       }]
});