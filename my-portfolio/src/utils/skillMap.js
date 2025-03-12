/**
 * Maps WordPress skill slugs to their properly formatted display names
 * Handles special cases like converting hyphens to periods for JS libraries
 */
export const skillNameMap = {
    // JavaScript libraries and frameworks
    'three-js': 'three.js',
    'cannon-js': 'cannon.js',
    'node-js': 'node.js',
    'vue-js': 'vue.js',
    'express-js': 'express.js',
    'd3-js': 'd3.js',
    'next-js': 'Next.js',
    'react-js': 'React.js',
    'gsap-js': 'GSAP',
    
    // Other technologies with special formatting
    'php': 'PHP',
    'html5': 'HTML5',
    'css3': 'CSS3',
    'sass': 'Sass',
    'mysql': 'MySQL',
    'postgresql': 'PostgreSQL',
    'aws': 'AWS',
    'ui-ux': 'UI/UX',
    'api': 'API',
    
    // Add more mappings as needed
  };
  
  /**
   * Formats a skill slug into a properly formatted display name
   * @param {string} skillSlug - The skill slug (without 'skills-' prefix)
   * @returns {string} - The formatted skill name
   */
  export const formatSkillName = (skillSlug) => {
    // Check if this skill has a special mapping
    if (skillNameMap[skillSlug]) {
      return skillNameMap[skillSlug];
    }
    
    // Default: replace hyphens with spaces and capitalize each word
    return skillSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };