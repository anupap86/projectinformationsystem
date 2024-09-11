class Collection {
  constructor(id, profile, address, education, reward, language_proficiency, scholarship, work_experience, family_information, training_and_development, faculty_activities) {
    this.id = id;
    this.profile = profile || {};
    this.address = address || {};
    this.education = education || {};
    this.reward = reward || {};
    this.language_proficiency = language_proficiency || {};
    this.scholarship = scholarship || {};
    this.work_experience = work_experience || {};
    this.family_information = family_information || {};
    this.training_and_development = training_and_development || {};
    this.faculty_activities = faculty_activities || {};
  }

  toFirestore() {
    return {
      profile: this.profile,
      address: this.address,
      education: this.education,
      reward: this.reward,
      language_proficiency: this.language_proficiency,
      scholarship: this.scholarship,
      work_experience: this.work_experience,
      family_information: this.family_information,
      training_and_development: this.training_and_development,
      faculty_activities: this.faculty_activities,
    };
  }
}

module.exports = Collection;