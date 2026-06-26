// Data for the 5 step-details pages.
// Each step shares the same UI structure with different content.
export const stepDetailsData = {
    1: {
        title: 'Step 1: Foundational Skills',
        description: "This step focuses on developing core competencies crucial for success in any field. You'll learn to communicate effectively, solve problems creatively, and collaborate seamlessly with others.",
        courses: [
            { name: 'Communication Skills', sub: 'Learn effective communication techniques' },
            { name: 'Problem Solving', sub: 'Develop your problem-solving abilities' },
            { name: 'Teamwork', sub: 'Enhance your teamwork and collaboration skills' },
        ],
        books: [
            { name: 'The Art of Communication', sub: 'A guide to effective communication' },
            { name: 'Creative Problem Solving', sub: 'Strategies for creative problem-solving' },
            { name: 'Teamwork Dynamics', sub: 'Building high-performing teams' },
        ],
        youtube: [
            { name: 'Communication Skills Explained', sub: 'Watch a video on communication skills' },
            { name: 'Problem Solving Techniques', sub: 'Learn about problem-solving techniques' },
            { name: 'Teamwork and Collaboration', sub: 'Explore teamwork and collaboration' },
        ],
    },
    2: {
        title: 'Step 2: Industry Knowledge',
        description: "This step builds your understanding of the software engineering industry. You'll explore current trends, tools, frameworks, and best practices used by professionals.",
        courses: [
            { name: 'Software Development Lifecycle', sub: 'Understanding SDLC methodologies' },
            { name: 'Agile & Scrum Basics', sub: 'Learn agile project management' },
            { name: 'Tech Industry Overview', sub: 'Explore major technology sectors' },
        ],
        books: [
            { name: 'Clean Code', sub: 'A guide to writing maintainable code' },
            { name: 'The Pragmatic Programmer', sub: 'Career advice for software developers' },
            { name: 'Soft Skills for Developers', sub: 'Professional growth in tech' },
        ],
        youtube: [
            { name: 'Intro to Software Engineering', sub: 'Overview of the field' },
            { name: 'Agile Explained', sub: 'Understanding agile methodology' },
            { name: 'Tech Career Paths', sub: 'Navigating your tech career' },
        ],
    },
    3: {
        title: 'Step 3: Advanced Techniques',
        description: 'Dive deep into advanced programming concepts, design patterns, and system architecture. This step prepares you for complex, real-world engineering challenges.',
        courses: [
            { name: 'Data Structures & Algorithms', sub: 'Master core CS fundamentals' },
            { name: 'System Design', sub: 'Learn to design scalable systems' },
            { name: 'Design Patterns', sub: 'Apply proven software patterns' },
        ],
        books: [
            { name: 'Introduction to Algorithms', sub: 'Comprehensive algorithms guide' },
            { name: 'Designing Data-Intensive Applications', sub: 'Scalable system design' },
            { name: 'Refactoring', sub: 'Improving the design of existing code' },
        ],
        youtube: [
            { name: 'System Design Interview', sub: 'How to ace system design' },
            { name: 'Advanced Algorithms', sub: 'Deep dive into algorithms' },
            { name: 'Software Architecture Patterns', sub: 'Common architecture approaches' },
        ],
    },
    4: {
        title: 'Step 4: Industry Knowledge',
        description: 'Continue building industry expertise with a focus on specialized domains, emerging technologies, and professional networking strategies.',
        courses: [
            { name: 'Cloud Computing Basics', sub: 'AWS, GCP, Azure fundamentals' },
            { name: 'DevOps & CI/CD', sub: 'Continuous integration pipelines' },
            { name: 'Security Fundamentals', sub: 'Secure coding practices' },
        ],
        books: [
            { name: 'The DevOps Handbook', sub: 'Accelerate software delivery' },
            { name: 'Cloud Architecture Patterns', sub: 'Building cloud-native apps' },
            { name: 'Security Engineering', sub: 'Building dependable distributed systems' },
        ],
        youtube: [
            { name: 'Cloud Platforms Compared', sub: 'AWS vs GCP vs Azure' },
            { name: 'DevOps Pipeline Tutorial', sub: 'Build your first CI/CD pipeline' },
            { name: 'Web Security Essentials', sub: 'Protecting modern web apps' },
        ],
    },
    5: {
        title: 'Step 5: Advanced Techniques',
        description: 'Capstone techniques for senior-level engineers. Focus on leadership, mentoring, architectural decision-making, and delivering production-grade software.',
        courses: [
            { name: 'Tech Leadership', sub: 'Leading engineering teams effectively' },
            { name: 'Performance Optimization', sub: 'Writing high-performance code' },
            { name: 'Open Source Contribution', sub: 'Contributing to open source projects' },
        ],
        books: [
            { name: 'An Elegant Puzzle', sub: 'Systems of engineering management' },
            { name: 'Staff Engineer', sub: 'Leadership beyond the management track' },
            { name: 'High Output Management', sub: 'Managing for results' },
        ],
        youtube: [
            { name: 'Becoming a Senior Engineer', sub: 'Career growth strategies' },
            { name: 'Code Review Best Practices', sub: 'Effective code review techniques' },
            { name: 'Open Source for Beginners', sub: 'How to start contributing' },
        ],
    },
}
