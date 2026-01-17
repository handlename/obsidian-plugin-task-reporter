import {
	formatTaskContent,
	formatTasks,
} from "../../src/services/task-formatter";
import type { PluginSettings } from "../../src/models/settings";
import type { Task } from "../../src/models/task";

describe("task-formatter", () => {
	const defaultSettings: PluginSettings = {
		targetHeading: "## 今日やったこと",
		targetTagPrefix: "#work/",
		excludeTagPatterns: ["#work/routine"],
		targetSubItemCheckChar: "k",
		canceledCheckChar: "-",
		schedulePrefix: "🗓️",
		includeScheduleItems: false,
		includeSubHeadings: false,
		removeAnchors: true,
	};

	const createTask = (
		content: string,
		level = 0,
		checkChar = "x",
		tags: string[] = [],
		isScheduleItem = false,
	): Task => ({
		content,
		level,
		checkChar,
		tags,
		lineNumber: 0,
		isScheduleItem,
	});

	describe("formatTaskContent", () => {
		it("should convert tags with target prefix", () => {
			const content = "Task with #work/dev tag";
			const result = formatTaskContent(content, defaultSettings);
			expect(result).toBe("Task with *dev* tag");
		});

		it("should remove internal links", () => {
			const content = "See [note](note.md) and [[wiki]]";
			const result = formatTaskContent(content, defaultSettings);
			expect(result).toBe("See note and wiki");
		});

		it("should format GitHub URLs", () => {
			const content = "Fixed https://github.com/owner/repo/issues/123";
			const result = formatTaskContent(content, defaultSettings);
			expect(result).toBe(
				"Fixed [repo#123](https://github.com/owner/repo/issues/123)",
			);
		});

		it("should apply all transformations in order", () => {
			const content =
				"#work/dev Fixed [[bug]] https://github.com/owner/repo/issues/123";
			const result = formatTaskContent(content, defaultSettings);
			expect(result).toBe(
				"*dev* Fixed bug [repo#123](https://github.com/owner/repo/issues/123)",
			);
		});

		it("should preserve external links", () => {
			const content = "See [website](https://example.com)";
			const result = formatTaskContent(content, defaultSettings);
			expect(result).toBe("See [website](https://example.com)");
		});

		it("should handle plain text without special formatting", () => {
			const content = "Plain task content";
			const result = formatTaskContent(content, defaultSettings);
			expect(result).toBe("Plain task content");
		});

		it("should remove anchors when removeAnchors is true", () => {
			const content = "Task content ^block-id";
			const result = formatTaskContent(content, defaultSettings);
			expect(result).toBe("Task content");
		});

		it("should preserve anchors when removeAnchors is false", () => {
			const content = "Task content ^block-id";
			const settings = { ...defaultSettings, removeAnchors: false };
			const result = formatTaskContent(content, settings);
			expect(result).toBe("Task content ^block-id");
		});
	});

	describe("formatTasks", () => {
		it("should format single task", () => {
			const tasks: Task[] = [createTask("Task 1 #work/dev")];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe("- Task 1 *dev*");
		});

		it("should format multiple tasks", () => {
			const tasks: Task[] = [
				createTask("Task 1 #work/dev"),
				createTask("Task 2 #work/review"),
			];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe("- Task 1 *dev*\n- Task 2 *review*");
		});

		it("should apply indentation for level 1 tasks", () => {
			const tasks: Task[] = [
				createTask("Parent task", 0),
				createTask("Sub task 1", 1, "k"),
				createTask("Sub task 2", 1, "k"),
			];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe(
				"- Parent task\n    - Sub task 1\n    - Sub task 2",
			);
		});

		it("should apply strikethrough for canceled tasks", () => {
			const tasks: Task[] = [createTask("Canceled task", 0, "-")];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe("- ~Canceled task~");
		});

		it("should preserve schedule prefix", () => {
			const tasks: Task[] = [createTask("📅 Scheduled task")];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe("- 📅 Scheduled task");
		});

		it("should handle mixed level and check chars", () => {
			const tasks: Task[] = [
				createTask("Task 1 #work/dev", 0, "x"),
				createTask("Sub task", 1, "k"),
				createTask("Canceled task", 0, "-"),
			];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe(
				"- Task 1 *dev*\n    - Sub task\n- ~Canceled task~",
			);
		});

		it("should handle tasks with all formatting features", () => {
			const tasks: Task[] = [
				createTask(
					"Fixed #work/dev [[bug]] https://github.com/owner/repo/issues/123",
					0,
					"x",
				),
				createTask("Sub task #work/review", 1, "k"),
				createTask("Canceled #work/task", 0, "-"),
			];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe(
				"- Fixed *dev* bug [repo#123](https://github.com/owner/repo/issues/123)\n    - Sub task *review*\n- ~Canceled *task*~",
			);
		});

		it("should handle canceled schedule items correctly", () => {
			const tasks: Task[] = [
				createTask("🗓️ 10:30 #work/project1 面談(キャンセル)", 0, "-"),
			];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe("- ~🗓️ 10:30 *project1* 面談(キャンセル)~");
		});

		it("should return empty string for empty tasks array", () => {
			const result = formatTasks([], defaultSettings);
			expect(result).toBe("");
		});

		it("should handle tasks without tags or special formatting", () => {
			const tasks: Task[] = [
				createTask("Simple task 1"),
				createTask("Simple task 2"),
			];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe("- Simple task 1\n- Simple task 2");
		});

		it("should use custom settings", () => {
			const customSettings: PluginSettings = {
				...defaultSettings,
				targetTagPrefix: "#project/",
				canceledCheckChar: "x",
			};
			const tasks: Task[] = [
				createTask("Task #project/alpha", 0, "x"),
				createTask("Not canceled", 0, "-"),
			];
			const result = formatTasks(tasks, customSettings);
			expect(result).toBe("- ~Task *alpha*~\n- Not canceled");
		});

		it("should preserve original content structure", () => {
			const tasks: Task[] = [
				createTask("Task with   multiple   spaces", 0),
				createTask("Task\twith\ttabs", 0),
			];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe(
				"- Task with   multiple   spaces\n- Task\twith\ttabs",
			);
		});

		it("should handle complex nested structure", () => {
			const tasks: Task[] = [
				createTask("Parent 1 #work/dev", 0, "x"),
				createTask("Sub 1-1", 1, "k"),
				createTask("Sub 1-2", 1, "k"),
				createTask("Parent 2 #work/review", 0, "x"),
				createTask("Sub 2-1", 1, "k"),
			];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe(
				"- Parent 1 *dev*\n    - Sub 1-1\n    - Sub 1-2\n- Parent 2 *review*\n    - Sub 2-1",
			);
		});

		it("should handle tasks with line breaks in content", () => {
			const tasks: Task[] = [createTask("Task with content", 0)];
			const result = formatTasks(tasks, defaultSettings);
			expect(result).toBe("- Task with content");
		});
	});
});
