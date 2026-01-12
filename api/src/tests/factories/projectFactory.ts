import { validProject } from '../fixtures/projects';

let idCounter = 1;

/**
 * Builds a project object with unique properties.
 * Useful for passing to ProjectModel.create() or as request body.
 */
export const buildProject = (overrides: Record<string, any> = {}) => {
    const id = idCounter++;
    return {
        ...validProject,
        title: `${validProject.title} ${id}`,
        description: `${validProject.description} ${id}`,
        ...overrides
    };
};

/**
 * Builds an array of project objects.
 */
export const buildProjects = (count: number, overrides: Record<string, any> = []) => {
    return Array.from({ length: count }).map(() => buildProject(overrides));
};

/**
 * Resets the internal ID counter.
 */
export const resetProjectFactory = () => {
    idCounter = 1;
};
