import React from 'react';
import { formatSkillName } from '../utils/skillMap';

function ProfileSkills({ skillsData }) {
  // Check if we have valid data
  if (!skillsData || !Array.isArray(skillsData) || skillsData.length === 0) {
    return <div className="skills-empty">No skills to display</div>;
  }
  // Find all parent categories (skills with parent = 0)
  const parentCategories = skillsData.filter(skill => skill.parent === 0);

  const childSkillByParent = {}
  skillsData.forEach(skill => {
    if (skill.parent !== 0) {
      if (!childSkillByParent[skill.parent]) {
        childSkillByParent[skill.parent] = [];
      }
      childSkillByParent[skill.parent].push(skill);
    }
  });

  return (
    <div className="hierarchical-skills">
    {parentCategories.map(category => (
      <div key={category.id} className="skill-category">
        <h3 className="category-title">{category.name}</h3>
        
        {childSkillByParent[category.id] && childSkillByParent[category.id].length > 0 ? (
          <div className="category-skills">
            {childSkillByParent[category.id].map(skill => (
              <div key={skill.id} className="skill-tag">
                {skill.name}
              </div>
            ))}
          </div>
        ) : (
          <p className="no-skills-in-category">No skills in this category</p>
        )}
      </div>
    ))}
  </div>
  );
}

export default ProfileSkills;