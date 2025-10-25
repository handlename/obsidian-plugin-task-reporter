import { filterByTag, filterSubItems } from '../../src/services/task-filter';
import type { Task } from '../../src/models/task';

describe('task-filter', () => {
	describe('filterByTag', () => {
		const createTask = (tags: string[], level = 0): Task => ({
			content: 'Test task',
			level,
			checkChar: 'x',
			tags,
			lineNumber: 0,
		});

		it('should filter tasks with matching tag prefix', () => {
			const tasks: Task[] = [
				createTask(['#work/dev']),
				createTask(['#work/review']),
				createTask(['#personal/hobby']),
			];

			const filtered = filterByTag(tasks, '#work/', []);

			expect(filtered).toHaveLength(2);
			expect(filtered[0].tags).toEqual(['#work/dev']);
			expect(filtered[1].tags).toEqual(['#work/review']);
		});

		it('should exclude tasks matching exclude patterns', () => {
			const tasks: Task[] = [
				createTask(['#work/dev']),
				createTask(['#work/routine']),
				createTask(['#work/review']),
			];

			const filtered = filterByTag(tasks, '#work/', ['#work/routine']);

			expect(filtered).toHaveLength(2);
			expect(filtered[0].tags).toEqual(['#work/dev']);
			expect(filtered[1].tags).toEqual(['#work/review']);
		});

		it('should handle multiple exclude patterns', () => {
			const tasks: Task[] = [
				createTask(['#work/dev']),
				createTask(['#work/routine']),
				createTask(['#work/daily']),
				createTask(['#work/review']),
			];

			const filtered = filterByTag(tasks, '#work/', ['#work/routine', '#work/daily']);

			expect(filtered).toHaveLength(2);
			expect(filtered[0].tags).toEqual(['#work/dev']);
			expect(filtered[1].tags).toEqual(['#work/review']);
		});

		it('should handle tasks with multiple tags', () => {
			const tasks: Task[] = [
				createTask(['#work/dev', '#important']),
				createTask(['#personal/hobby', '#work/review']),
				createTask(['#personal/hobby']),
			];

			const filtered = filterByTag(tasks, '#work/', []);

			expect(filtered).toHaveLength(2);
		});

		it('should exclude task if any tag matches exclude pattern', () => {
			const tasks: Task[] = [
				createTask(['#work/dev', '#work/routine']),
				createTask(['#work/review']),
			];

			const filtered = filterByTag(tasks, '#work/', ['#work/routine']);

			expect(filtered).toHaveLength(1);
			expect(filtered[0].tags).toEqual(['#work/review']);
		});

		it('should return empty array when no tasks match', () => {
			const tasks: Task[] = [createTask(['#personal/hobby']), createTask(['#project/alpha'])];

			const filtered = filterByTag(tasks, '#work/', []);

			expect(filtered).toEqual([]);
		});

		it('should return empty array for empty input', () => {
			const filtered = filterByTag([], '#work/', []);
			expect(filtered).toEqual([]);
		});

		it('should handle tasks without tags', () => {
			const tasks: Task[] = [createTask([]), createTask(['#work/dev'])];

			const filtered = filterByTag(tasks, '#work/', []);

			expect(filtered).toHaveLength(1);
			expect(filtered[0].tags).toEqual(['#work/dev']);
		});

		it('should handle empty exclude patterns', () => {
			const tasks: Task[] = [createTask(['#work/dev']), createTask(['#work/review'])];

			const filtered = filterByTag(tasks, '#work/', []);

			expect(filtered).toHaveLength(2);
		});

		it('should preserve task properties', () => {
			const tasks: Task[] = [
				{
					content: 'Task content',
					level: 0,
					checkChar: 'x',
					tags: ['#work/dev'],
					lineNumber: 5,
				},
			];

			const filtered = filterByTag(tasks, '#work/', []);

			expect(filtered[0]).toEqual({
				content: 'Task content',
				level: 0,
				checkChar: 'x',
				tags: ['#work/dev'],
				lineNumber: 5,
			});
		});
	});

	describe('filterSubItems', () => {
		const createTask = (level: number, checkChar: string): Task => ({
			content: 'Test task',
			level,
			checkChar,
			tags: [],
			lineNumber: 0,
		});

		it('should include all level 0 tasks', () => {
			const tasks: Task[] = [
				createTask(0, 'x'),
				createTask(0, ' '),
				createTask(0, '-'),
			];

			const filtered = filterSubItems(tasks, 'k');

			expect(filtered).toHaveLength(3);
		});

		it('should filter level 1 tasks by check char', () => {
			const tasks: Task[] = [
				createTask(1, 'k'),
				createTask(1, 'x'),
				createTask(1, 'k'),
			];

			const filtered = filterSubItems(tasks, 'k');

			expect(filtered).toHaveLength(2);
			expect(filtered[0].checkChar).toBe('k');
			expect(filtered[1].checkChar).toBe('k');
		});

		it('should handle mixed level tasks', () => {
			const tasks: Task[] = [
				createTask(0, 'x'),
				createTask(1, 'k'),
				createTask(1, 'x'),
				createTask(0, '-'),
				createTask(1, 'k'),
			];

			const filtered = filterSubItems(tasks, 'k');

			expect(filtered).toHaveLength(4);
			expect(filtered[0].level).toBe(0);
			expect(filtered[1].level).toBe(1);
			expect(filtered[1].checkChar).toBe('k');
			expect(filtered[2].level).toBe(0);
			expect(filtered[3].level).toBe(1);
			expect(filtered[3].checkChar).toBe('k');
		});

		it('should return empty array for empty input', () => {
			const filtered = filterSubItems([], 'k');
			expect(filtered).toEqual([]);
		});

		it('should filter out all level 1 tasks when none match', () => {
			const tasks: Task[] = [
				createTask(0, 'x'),
				createTask(1, 'x'),
				createTask(1, ' '),
			];

			const filtered = filterSubItems(tasks, 'k');

			expect(filtered).toHaveLength(1);
			expect(filtered[0].level).toBe(0);
		});

		it('should handle only level 0 tasks', () => {
			const tasks: Task[] = [createTask(0, 'x'), createTask(0, '-')];

			const filtered = filterSubItems(tasks, 'k');

			expect(filtered).toHaveLength(2);
		});

		it('should handle only level 1 tasks', () => {
			const tasks: Task[] = [
				createTask(1, 'k'),
				createTask(1, 'x'),
				createTask(1, 'k'),
			];

			const filtered = filterSubItems(tasks, 'k');

			expect(filtered).toHaveLength(2);
		});

		it('should preserve task properties', () => {
			const tasks: Task[] = [
				{
					content: 'Parent task',
					level: 0,
					checkChar: 'x',
					tags: ['#work/dev'],
					lineNumber: 1,
				},
				{
					content: 'Sub task',
					level: 1,
					checkChar: 'k',
					tags: ['#work/review'],
					lineNumber: 2,
				},
			];

			const filtered = filterSubItems(tasks, 'k');

			expect(filtered).toHaveLength(2);
			expect(filtered[0].content).toBe('Parent task');
			expect(filtered[1].content).toBe('Sub task');
		});
	});
});
