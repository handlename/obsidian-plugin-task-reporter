import {
	extractTags,
	findHeading,
	getHeadingLevel,
	parseTaskList,
} from "../../src/utils/markdown-parser";
import type { Task } from "../../src/models/task";

describe("markdown-parser", () => {
	describe("findHeading", () => {
		it("should find heading at the beginning", () => {
			const content = "## 今日やったこと\nsome content";
			expect(findHeading(content, "## 今日やったこと")).toBe(0);
		});

		it("should find heading in the middle", () => {
			const content = "line 1\nline 2\n## 今日やったこと\nsome content";
			expect(findHeading(content, "## 今日やったこと")).toBe(2);
		});

		it("should return null when heading is not found", () => {
			const content = "line 1\nline 2\n## Other heading";
			expect(findHeading(content, "## 今日やったこと")).toBeNull();
		});

		it("should trim whitespace when matching", () => {
			const content = "  ## 今日やったこと  \nsome content";
			expect(findHeading(content, "## 今日やったこと")).toBe(0);
		});

		it("should handle empty content", () => {
			expect(findHeading("", "## 今日やったこと")).toBeNull();
		});

		it("should handle content with only newlines", () => {
			expect(findHeading("\n\n\n", "## 今日やったこと")).toBeNull();
		});
	});

	describe("parseTaskList", () => {
		const schedulePrefix = "🗓️";

		it("should parse single task", () => {
			const lines = ["- [x] Task 1 #work/dev"];
			const tasks = parseTaskList(lines, schedulePrefix);

			expect(tasks).toHaveLength(1);
			expect(tasks[0]).toEqual({
				content: "Task 1 #work/dev",
				level: 0,
				checkChar: "x",
				tags: ["#work/dev"],
				lineNumber: 0,
				isScheduleItem: false,
			});
		});

		it("should parse multiple tasks with different check chars", () => {
			const lines = ["- [x] Task 1", "- [ ] Task 2", "- [-] Task 3"];
			const tasks = parseTaskList(lines, schedulePrefix);

			expect(tasks).toHaveLength(3);
			expect(tasks[0].checkChar).toBe("x");
			expect(tasks[1].checkChar).toBe(" ");
			expect(tasks[2].checkChar).toBe("-");
		});

		it("should distinguish level 0 and level 1 tasks", () => {
			const lines = ["- [x] Level 0 task", "\t- [k] Level 1 task"];
			const tasks = parseTaskList(lines, schedulePrefix);

			expect(tasks).toHaveLength(2);
			expect(tasks[0].level).toBe(0);
			expect(tasks[1].level).toBe(1);
		});

		it("should handle tasks with multiple tags", () => {
			const lines = ["- [x] Task #work/dev #important #urgent"];
			const tasks = parseTaskList(lines, schedulePrefix);

			expect(tasks[0].tags).toEqual([
				"#work/dev",
				"#important",
				"#urgent",
			]);
		});

		it("should handle tasks without tags", () => {
			const lines = ["- [x] Task without tags"];
			const tasks = parseTaskList(lines, schedulePrefix);

			expect(tasks[0].tags).toEqual([]);
		});

		it("should handle empty lines and non-task lines", () => {
			const lines = ["- [x] Task 1", "", "Not a task", "- [x] Task 2"];
			const tasks = parseTaskList(lines, schedulePrefix);

			expect(tasks).toHaveLength(2);
			expect(tasks[0].content).toBe("Task 1");
			expect(tasks[1].content).toBe("Task 2");
		});

		it("should track correct line numbers", () => {
			const lines = ["some text", "- [x] Task 1", "", "- [x] Task 2"];
			const tasks = parseTaskList(lines, schedulePrefix);

			expect(tasks[0].lineNumber).toBe(1);
			expect(tasks[1].lineNumber).toBe(3);
		});

		it("should handle custom check characters", () => {
			const lines = ["- [k] Keep task", "- [>] Forwarded task"];
			const tasks = parseTaskList(lines, schedulePrefix);

			expect(tasks[0].checkChar).toBe("k");
			expect(tasks[1].checkChar).toBe(">");
		});

		it("should return empty array for empty input", () => {
			expect(parseTaskList([], schedulePrefix)).toEqual([]);
		});

		it("should detect schedule items with schedule prefix", () => {
			const lines = ["- [ ] 🗓️ 11:00 休憩", "- [x] Task without prefix"];
			const tasks = parseTaskList(lines, schedulePrefix);

			expect(tasks).toHaveLength(2);
			expect(tasks[0].isScheduleItem).toBe(true);
			expect(tasks[1].isScheduleItem).toBe(false);
		});

		it("should detect schedule items with prefix and whitespace", () => {
			const lines = ["- [ ]  🗓️ 11:00 休憩"];
			const tasks = parseTaskList(lines, schedulePrefix);

			expect(tasks[0].isScheduleItem).toBe(true);
		});

		it("should not detect non-schedule items", () => {
			const lines = [
				"- [x] Regular task #work/dev",
				"- [ ] Another task",
			];
			const tasks = parseTaskList(lines, schedulePrefix);

			expect(tasks[0].isScheduleItem).toBe(false);
			expect(tasks[1].isScheduleItem).toBe(false);
		});
	});

	describe("extractTags", () => {
		it("should extract single tag", () => {
			const text = "Task with #work/dev tag";
			expect(extractTags(text)).toEqual(["#work/dev"]);
		});

		it("should extract multiple tags", () => {
			const text = "Task #work/dev #important #urgent";
			expect(extractTags(text)).toEqual([
				"#work/dev",
				"#important",
				"#urgent",
			]);
		});

		it("should extract tags with slashes", () => {
			const text = "Task #work/dev/frontend #project/alpha";
			expect(extractTags(text)).toEqual([
				"#work/dev/frontend",
				"#project/alpha",
			]);
		});

		it("should return empty array when no tags", () => {
			const text = "Task without tags";
			expect(extractTags(text)).toEqual([]);
		});

		it("should handle tags at different positions", () => {
			const text = "#start middle #middle end #end";
			expect(extractTags(text)).toEqual(["#start", "#middle", "#end"]);
		});

		it("should handle empty string", () => {
			expect(extractTags("")).toEqual([]);
		});

		it("should handle tags with underscores", () => {
			const text = "Task #work_item #project_alpha";
			expect(extractTags(text)).toEqual(["#work_item", "#project_alpha"]);
		});

		it("should not extract incomplete tags", () => {
			const text = "Task with # only or #";
			expect(extractTags(text)).toEqual([]);
		});
	});

	describe("getHeadingLevel", () => {
		it("should return 1 for h1 heading", () => {
			expect(getHeadingLevel("# Heading")).toBe(1);
		});

		it("should return 2 for h2 heading", () => {
			expect(getHeadingLevel("## Heading")).toBe(2);
		});

		it("should return 3 for h3 heading", () => {
			expect(getHeadingLevel("### Heading")).toBe(3);
		});

		it("should return 6 for h6 heading", () => {
			expect(getHeadingLevel("###### Heading")).toBe(6);
		});

		it("should return null for non-heading lines", () => {
			expect(getHeadingLevel("Not a heading")).toBeNull();
			expect(getHeadingLevel("- [x] Task")).toBeNull();
			expect(getHeadingLevel("")).toBeNull();
		});

		it("should handle heading with leading whitespace", () => {
			expect(getHeadingLevel("  ## Heading")).toBe(2);
		});

		it("should return null for # without space after", () => {
			expect(getHeadingLevel("#NoSpace")).toBeNull();
		});

		it("should return null for # at end of line", () => {
			expect(getHeadingLevel("Text with #")).toBeNull();
		});
	});
});
