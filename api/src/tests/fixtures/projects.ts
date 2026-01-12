
export const validProject = {
    title: 'Valid Project',
    description: 'A valid description',
    version: '1.0.0',
    link: 'http://valid-project.com',
    tag: 'TypeScript, Node.js',
    timestamp: Date.now()
};

export const invalidProjects = {
    missingTitle: {
        description: 'Missing title',
        version: '1.0.0',
        link: 'http://missing-title.com',
        tag: 'Invalid',
        timestamp: Date.now()
    },
    missingDescription: {
        title: 'Missing Description',
        version: '1.0.0',
        link: 'http://missing-description.com',
        tag: 'Invalid',
        timestamp: Date.now()
    },
    invalidUrl: {
        title: 'Invalid URL',
        description: 'URL is not valid string',
        version: '1.0.0',
        link: 12345, // Invalid type
        tag: 'Invalid',
        timestamp: Date.now()
    }
};

export const sampleProjects = [
    {
        title: 'Project Alpha',
        description: 'First sample project',
        version: '0.1.0',
        link: 'http://alpha.com',
        tag: 'Alpha',
        timestamp: Date.now()
    },
    {
        title: 'Project Beta',
        description: 'Second sample project',
        version: '0.2.0',
        link: 'http://beta.com',
        tag: 'Beta',
        timestamp: Date.now() - 10000
    },
    {
        title: 'Project Gamma',
        description: 'Third sample project',
        version: '1.0.0',
        link: 'http://gamma.com',
        tag: 'Gamma',
        timestamp: Date.now() - 20000
    }
];
