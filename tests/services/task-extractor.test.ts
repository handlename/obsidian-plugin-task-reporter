import { extractTasksFromHeading } from "../../src/services/task-extractor";

describe("task-extractor", () => {
	const schedulePrefix = "🗓️";

	describe("extractTasksFromHeading", () => {
		it("should extract tasks from heading section", () => {
			const content = `# Daily Note
## 今日やったこと
- [x] Task 1 #work/dev
- [ ] Task 2 #work/review
## Other Section`;

			const tasks = extractTasksFromHeading(
				content,
				"## 今日やったこと",
				schedulePrefix,
			);

			expect(tasks).toHaveLength(2);
			expect(tasks[0].content).toBe("Task 1 #work/dev");
			expect(tasks[1].content).toBe("Task 2 #work/review");
		});

		it("should extract tasks with sub-items", () => {
			const content = `## 今日やったこと
- [x] Parent task
\t- [k] Sub task 1
\t- [k] Sub task 2`;

			const tasks = extractTasksFromHeading(
				content,
				"## 今日やったこと",
				schedulePrefix,
			);

			expect(tasks).toHaveLength(3);
			expect(tasks[0].level).toBe(0);
			expect(tasks[1].level).toBe(1);
			expect(tasks[2].level).toBe(1);
		});

		it("should stop at next heading", () => {
			const content = `## 今日やったこと
- [x] Task 1
- [x] Task 2
## Next Section
- [x] Task 3`;

			const tasks = extractTasksFromHeading(
				content,
				"## 今日やったこと",
				schedulePrefix,
			);

			expect(tasks).toHaveLength(2);
			expect(tasks[0].content).toBe("Task 1");
			expect(tasks[1].content).toBe("Task 2");
		});

		it("should handle heading at document end", () => {
			const content = `## Other Section
Some content
## 今日やったこと
- [x] Task 1
- [x] Task 2`;

			const tasks = extractTasksFromHeading(
				content,
				"## 今日やったこと",
				schedulePrefix,
			);

			expect(tasks).toHaveLength(2);
			expect(tasks[0].content).toBe("Task 1");
			expect(tasks[1].content).toBe("Task 2");
		});

		it("should return empty array when heading not found", () => {
			const content = `## Other Section
- [x] Task 1`;

			const tasks = extractTasksFromHeading(
				content,
				"## 今日やったこと",
				schedulePrefix,
			);

			expect(tasks).toEqual([]);
		});

		it("should return empty array when no tasks under heading", () => {
			const content = `## 今日やったこと
Some text without tasks
## Next Section`;

			const tasks = extractTasksFromHeading(
				content,
				"## 今日やったこと",
				schedulePrefix,
			);

			expect(tasks).toEqual([]);
		});

		it("should handle empty lines between tasks", () => {
			const content = `## 今日やったこと
- [x] Task 1

- [x] Task 2

## Next Section`;

			const tasks = extractTasksFromHeading(
				content,
				"## 今日やったこと",
				schedulePrefix,
			);

			expect(tasks).toHaveLength(2);
		});

		it("should handle mixed content (tasks and non-tasks)", () => {
			const content = `## 今日やったこと
Some descriptive text
- [x] Task 1
More text
- [x] Task 2
## Next Section`;

			const tasks = extractTasksFromHeading(
				content,
				"## 今日やったこと",
				schedulePrefix,
			);

			expect(tasks).toHaveLength(2);
		});

		it("should handle h1 heading", () => {
			const content = `# Main Heading
- [x] Task 1
- [x] Task 2
## Sub Heading`;

			const tasks = extractTasksFromHeading(
				content,
				"# Main Heading",
				schedulePrefix,
			);

			expect(tasks).toHaveLength(2);
		});

		it("should handle h3 and deeper headings", () => {
			const content = `### Deep Heading
- [x] Task 1
#### Deeper Heading`;

			const tasks = extractTasksFromHeading(
				content,
				"### Deep Heading",
				schedulePrefix,
			);

			expect(tasks).toHaveLength(1);
		});

		it("should preserve task metadata", () => {
			const content = `## 今日やったこと
- [x] Task with #tag1 #tag2
- [-] Canceled task`;

			const tasks = extractTasksFromHeading(
				content,
				"## 今日やったこと",
				schedulePrefix,
			);

			expect(tasks[0].tags).toEqual(["#tag1", "#tag2"]);
			expect(tasks[0].checkChar).toBe("x");
			expect(tasks[1].checkChar).toBe("-");
		});

		it("should handle empty content", () => {
			const tasks = extractTasksFromHeading(
				"",
				"## 今日やったこと",
				schedulePrefix,
			);
			expect(tasks).toEqual([]);
		});

		it("should handle content with only heading", () => {
			const content = "## 今日やったこと";
			const tasks = extractTasksFromHeading(
				content,
				"## 今日やったこと",
				schedulePrefix,
			);
			expect(tasks).toEqual([]);
		});
	});

	describe("extractTasksFromHeading with includeSubHeadings", () => {
		it("should not include tasks under sub-headings when includeSubHeadings is false", () => {
			const content = `## Task

- [ ] #work/main task1
- [ ] #work/main task2

### Task Group A

- [ ] #work/groupA task1
- [ ] #work/groupA task2`;

			const tasks = extractTasksFromHeading(
				content,
				"## Task",
				schedulePrefix,
				false,
			);

			expect(tasks).toHaveLength(2);
			expect(tasks[0].content).toBe("#work/main task1");
			expect(tasks[1].content).toBe("#work/main task2");
		});

		it("should include tasks under sub-headings when includeSubHeadings is true", () => {
			const content = `## Task

- [ ] #work/main task1
- [ ] #work/main task2

### Task Group A

- [ ] #work/groupA task1
- [ ] #work/groupA task2

### Task Group B

- [ ] #work/groupB task1`;

			const tasks = extractTasksFromHeading(
				content,
				"## Task",
				schedulePrefix,
				true,
			);

			expect(tasks).toHaveLength(5);
			expect(tasks[0].content).toBe("#work/main task1");
			expect(tasks[1].content).toBe("#work/main task2");
			expect(tasks[2].content).toBe("#work/groupA task1");
			expect(tasks[3].content).toBe("#work/groupA task2");
			expect(tasks[4].content).toBe("#work/groupB task1");
		});

		it("should stop at same-level heading even when includeSubHeadings is true", () => {
			const content = `## Task

- [ ] #work/main task1

### Sub Heading

- [ ] #work/sub task1

## Other Section

- [ ] #work/other task1`;

			const tasks = extractTasksFromHeading(
				content,
				"## Task",
				schedulePrefix,
				true,
			);

			expect(tasks).toHaveLength(2);
			expect(tasks[0].content).toBe("#work/main task1");
			expect(tasks[1].content).toBe("#work/sub task1");
		});

		it("should handle multiple levels of sub-headings", () => {
			const content = `## Task

- [ ] task1

### Level 3

- [ ] task2

#### Level 4

- [ ] task3

##### Level 5

- [ ] task4`;

			const tasks = extractTasksFromHeading(
				content,
				"## Task",
				schedulePrefix,
				true,
			);

			expect(tasks).toHaveLength(4);
			expect(tasks[0].content).toBe("task1");
			expect(tasks[1].content).toBe("task2");
			expect(tasks[2].content).toBe("task3");
			expect(tasks[3].content).toBe("task4");
		});

		it("should handle empty sub-headings", () => {
			const content = `## Task

- [ ] task1

### Empty Sub Heading

### Another Sub Heading

- [ ] task2`;

			const tasks = extractTasksFromHeading(
				content,
				"## Task",
				schedulePrefix,
				true,
			);

			expect(tasks).toHaveLength(2);
			expect(tasks[0].content).toBe("task1");
			expect(tasks[1].content).toBe("task2");
		});

		it("should handle h1 heading with sub-headings", () => {
			const content = `# Main

- [ ] task1

## Sub

- [ ] task2

# Other Main

- [ ] task3`;

			const tasks = extractTasksFromHeading(
				content,
				"# Main",
				schedulePrefix,
				true,
			);

			expect(tasks).toHaveLength(2);
			expect(tasks[0].content).toBe("task1");
			expect(tasks[1].content).toBe("task2");
		});

		it("should default to false when includeSubHeadings is not provided", () => {
			const content = `## Task

- [ ] task1

### Sub Heading

- [ ] task2`;

			const tasks = extractTasksFromHeading(
				content,
				"## Task",
				schedulePrefix,
			);

			expect(tasks).toHaveLength(1);
			expect(tasks[0].content).toBe("task1");
		});
	});
});
