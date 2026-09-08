import { Slide } from '../types';

export const slidesCoding: Slide[] = [
  {
    id: 'coding-divider',
    slideNumber: 48,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '06 — TCS IGNITE — CODING, DSA & SQL ANSWERS',
    slideSubtitle: 'Most-Asked Technical Questions in TCS Ignite (High Priority)',
    isDivider: true,
    content: {
      paragraphs: [
        'Complete repository of high-frequency technical questions, Python algorithms, and SQL scenario-based query challenges.',
        'Includes project-based questions, core string/array manipulations, mathematical tests, sorting algorithms, dynamic subarray techniques (Kadane\'s, Prefix Sum), salary algorithms/queries, JOIN scenarios, and Database Normalization.'
      ],
      keyNotes: [
        'All Python and SQL codes are 100% faithful to original study material',
        'Includes time/space complexity notes and interviewer follow-up tips'
      ]
    },
    tags: ['coding', 'dsa', 'sql', 'python', 'algorithms']
  },
  {
    id: 'coding-project-questions',
    slideNumber: 49,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: 'Project-Based Technical Questions',
    slideSubtitle: 'Almost Always Asked in the Technical Round',
    content: {
      paragraphs: [
        '1. Project-based (almost always asked):'
      ],
      callouts: [
        {
          type: 'interview',
          label: 'Question 1',
          content: 'Explain your final-year / main project in detail.'
        },
        {
          type: 'interview',
          label: 'Question 2',
          content: 'What technologies did you use in your project and why?'
        },
        {
          type: 'interview',
          label: 'Question 3',
          content: 'What problems did you face in your project and how did you solve them?'
        },
        {
          type: 'interview',
          label: 'Question 4',
          content: 'How does the backend of your project work? (APIs, DB, flow)'
        }
      ]
    },
    tags: ['projects', 'final-year', 'architecture', 'backend']
  },
  {
    id: 'coding-q1-reverse-string',
    slideNumber: 50,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '1. Reverse a String',
    slideSubtitle: 'Two-Pointer Swap vs Built-in Slicing',
    content: {
      codeBlocks: [
        {
          language: 'python',
          title: 'Without built-ins (two-pointer swap)',
          code: `def reverse_string(s):
    chars = list(s)
    left, right = 0, len(chars) - 1
    while left < right:
        chars[left], chars[right] = chars[right], chars[left]
        left += 1
        right -= 1
    return "".join(chars)`
        },
        {
          language: 'python',
          title: 'With built-ins',
          code: `reversed_s = s[::-1]`
        }
      ],
      callouts: [
        {
          type: 'priority',
          label: 'Complexity',
          content: 'O(n) time, O(n) space — strings are immutable, so you\'re always building a new one.'
        }
      ]
    },
    tags: ['reverse string', 'two-pointer', 'slicing']
  },
  {
    id: 'coding-q2-q3-palindrome-second-largest',
    slideNumber: 51,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '2. Palindrome Check & 3. Second-Largest Element',
    slideSubtitle: 'Two-Pointer String Comparison & Single-Pass Array Scan',
    content: {
      codeBlocks: [
        {
          language: 'python',
          title: '2. Check if a String is a Palindrome',
          code: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

# Quicker to write if it's allowed:
# s == s[::-1]`
        },
        {
          language: 'python',
          title: '3. Second-Largest Element in an Array',
          code: `def second_largest(arr):
    first = second = float('-inf')
    for num in arr:
        if num > first:
            second = first
            first = num
        elif first > num > second:
            second = num
    return second`
        }
      ],
      callouts: [
        {
          type: 'warning',
          label: '⚠️ Watch for in Q3 (Second Largest)',
          content: 'Duplicate max values (e.g. [5, 5, 3] → second should be 3, not 5) and arrays with fewer than 2 distinct values. The strict first > num > second check above already handles the duplicate case correctly — worth pointing that out unprompted.\nComplexity: O(n) time, O(1) space — single pass, no sorting needed.'
        }
      ]
    },
    tags: ['palindrome', 'second largest', 'single pass']
  },
  {
    id: 'coding-q4-q5-max-min-char-count',
    slideNumber: 52,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '4. Max & Min in One Pass & 5. Count Character Occurrences',
    slideSubtitle: 'Single-Pass Min/Max & Frequency Map Techniques',
    content: {
      codeBlocks: [
        {
          language: 'python',
          title: '4. Max and Min in One Pass',
          code: `def max_min(arr):
    mx = mn = arr[0]
    for num in arr[1:]:
        if num > mx:
            mx = num
        elif num < mn:
            mn = num
    return mx, mn`
        },
        {
          language: 'python',
          title: '5. Count Occurrences of Each Character in a String',
          code: `# Without built-ins:
def char_count(s):
    counts = {}
    for ch in s:
        counts[ch] = counts.get(ch, 0) + 1
    return counts

# With built-ins:
from collections import Counter
counts = Counter(s)

# char_count("banana") → {'b': 1, 'a': 3, 'n': 2}`
        }
      ],
      callouts: [
        {
          type: 'priority',
          label: 'Q4 & Q5 Explanations & Follow-up',
          content: '• Q4 Note: The naive approach calls max() and min() separately — two full passes. This does both in a single pass, which is the point interviewers are checking for.\n• Q5 Complexity: O(n) time, O(k) space where k is the number of distinct characters. If asked to handle case-insensitivity or ignore spaces, normalize with s.lower() and filter before counting — interviewers often add that as a follow-up.'
        }
      ]
    },
    tags: ['max min', 'char count', 'counter', 'hash map']
  },
  {
    id: 'coding-q6-q7-word-count-prime-armstrong',
    slideNumber: 53,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '6. Word Count & 7. Prime / Armstrong / Palindrome Number',
    slideSubtitle: 'Whitespace Splitting & Mathematical Property Checks',
    content: {
      codeBlocks: [
        {
          language: 'python',
          title: '6. Count the Number of Words in a String',
          code: `def word_count(s):
    return len(s.split())`
        },
        {
          language: 'python',
          title: '7. Prime / Armstrong / Palindrome Number',
          code: `# Prime — only check divisors up to √n:
def is_prime(n):
    if n < 2:
        return False
    for i in range(2, int(n ** 0.5) + 1):
        if n % i == 0:
            return False
    return True

# Armstrong — sum of each digit raised to digit-count equals number (153 = 1³+5³+3³):
def is_armstrong(n):
    digits = str(n)
    power = len(digits)
    return n == sum(int(d) ** power for d in digits)

# Palindrome number — reverse digits and compare, without converting to string:
def is_palindrome_number(n):
    if n < 0:
        return False
    original, reversed_num = n, 0
    while n > 0:
        reversed_num = reversed_num * 10 + n % 10
        n //= 10
    return original == reversed_num`
        }
      ],
      callouts: [
        {
          type: 'warning',
          label: '⚠️ Explanations & Gotchas',
          content: '• Q6: .split() with no arguments splits on any whitespace and automatically collapses multiple spaces/tabs/newlines, so "  the sky   is blue " still correctly counts as 4 words. A naive len(s.split(" ")) would overcount on extra spaces. Complexity: O(n).\n• Q7: Negative numbers aren\'t palindromes by convention (the - sign breaks symmetry) — the check above handles that explicitly. All three run in O(log n) or O(√n) time depending on the check, not O(n), which is worth stating if asked.'
        }
      ]
    },
    tags: ['word count', 'prime', 'armstrong', 'palindrome number']
  },
  {
    id: 'coding-q8-q9-factorial-fibonacci',
    slideNumber: 54,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '8. Factorial of a Number & 9. Fibonacci Series',
    slideSubtitle: 'Iterative vs Recursive Approaches with Complexity Analysis',
    content: {
      codeBlocks: [
        {
          language: 'python',
          title: '8. Factorial (Iterative & Recursive)',
          code: `# Iterative:
def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

# Recursive:
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)`
        },
        {
          language: 'python',
          title: '9. Fibonacci Series up to N Terms',
          code: `# Iterative:
def fibonacci(n):
    series = []
    a, b = 0, 1
    for _ in range(n):
        series.append(a)
        a, b = b, a + b
    return series

# Recursive:
def fib(n):
    if n <= 1:
        return n
    return fib(n - 1) + fib(n - 2)`
        }
      ],
      callouts: [
        {
          type: 'priority',
          label: 'Complexity & Interview Optimization Note',
          content: '• Q8 Factorial: O(n) either way; recursive uses O(n) call-stack space, iterative uses O(1).\n• Q9 Fibonacci: Iterative is O(n). Naive recursive is O(2ⁿ) — if asked to optimize, mention memoization (caching each fib(n) result) to bring it back down to O(n).'
        }
      ]
    },
    tags: ['factorial', 'fibonacci', 'recursion', 'memoization']
  },
  {
    id: 'coding-q10-peak-elements',
    slideNumber: 55,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '10. Find All Peak Elements in an Array',
    slideSubtitle: 'Boundary Handling & Follow-up Binary Search Optimization',
    content: {
      paragraphs: [
        'A peak is an element strictly greater than its immediate neighbors. Edge elements only need to beat their one neighbor.'
      ],
      codeBlocks: [
        {
          language: 'python',
          title: 'Peak Elements Code',
          code: `def find_peaks(arr):
    n = len(arr)
    peaks = []
    for i in range(n):
        left_ok = (i == 0) or (arr[i] > arr[i - 1])
        right_ok = (i == n - 1) or (arr[i] > arr[i + 1])
        if left_ok and right_ok:
            peaks.append(i)
    return peaks

# find_peaks([1, 3, 2, 4, 1]) → indices [1, 3] (values 3 and 4)`
        }
      ],
      callouts: [
        {
          type: 'priority',
          label: 'Complexity & Follow-Up',
          content: 'O(n) time, O(1) extra space (excluding output).\n\nFollow-up interviewers like to ask: "find a single peak in O(log n)" — that\'s a different problem solvable with binary search, moving toward whichever neighbor is larger, since a peak is guaranteed to exist in that direction.'
        }
      ]
    },
    tags: ['peak elements', 'array', 'binary search']
  },
  {
    id: 'coding-q11-merge-sorted-arrays',
    slideNumber: 56,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '11. Merge Two Sorted Arrays (Without Built-in Sort)',
    slideSubtitle: 'Two-Pointer Linear Merge & In-Place Backwards Variant',
    content: {
      paragraphs: [
        'Two-pointer merge — the core idea behind the merge step of merge sort:'
      ],
      codeBlocks: [
        {
          language: 'python',
          title: 'Merge Sorted Arrays Code',
          code: `def merge_sorted(arr1, arr2):
    merged = []
    i, j = 0, 0
    while i < len(arr1) and j < len(arr2):
        if arr1[i] <= arr2[j]:
            merged.append(arr1[i])
            i += 1
        else:
            merged.append(arr2[j])
            j += 1
    merged.extend(arr1[i:])
    merged.extend(arr2[j:])
    return merged`
        }
      ],
      callouts: [
        {
          type: 'warning',
          label: '⚠️ Complexity & Gotcha',
          content: 'O(n + m) time, O(n + m) space — each element is visited exactly once; no comparison-based sorting is happening, just a linear merge of two already-sorted inputs.\n\nWatch for: interviewers asking you to do this in-place when arr1 has trailing empty space to hold arr2 — that variant is solved by merging from the back of both arrays to avoid overwriting unprocessed elements.'
        }
      ]
    },
    tags: ['merge sorted arrays', 'two pointers', 'in-place']
  },
  {
    id: 'coding-q12-sort-algorithms',
    slideNumber: 57,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '12. Bubble / Selection / Insertion Sort — Explain Logic',
    slideSubtitle: 'Comparison of Elementary Sorting Algorithms & Nuances',
    content: {
      codeBlocks: [
        {
          language: 'python',
          title: 'Bubble, Selection & Insertion Sort Implementations',
          code: `# Bubble sort — repeatedly swap adjacent out-of-order elements:
def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr

# Selection sort — find minimum of unsorted portion and swap into place:
def selection_sort(arr):
    n = len(arr)
    for i in range(n):
        min_idx = i
        for j in range(i + 1, n):
            if arr[j] < arr[min_idx]:
                min_idx = j
        arr[i], arr[min_idx] = arr[min_idx], arr[i]
    return arr

# Insertion sort — grow sorted prefix, shifting larger elements right:
def insertion_sort(arr):
    for i in range(1, len(arr)):
        key = arr[i]
        j = i - 1
        while j >= 0 and arr[j] > key:
            arr[j + 1] = arr[j]
            j -= 1
        arr[j + 1] = key
    return arr`
        }
      ],
      callouts: [
        {
          type: 'priority',
          label: 'Complexity & Distinguishing Point Interviewers Listen For',
          content: 'All three are O(n²) time in the worst case, O(1) extra space.\n\nDistinguishing point: bubble sort does the most swaps (inefficient), selection sort does the fewest swaps but always scans the full remaining array, and insertion sort is the only one of the three that\'s efficient on nearly-sorted data (O(n) best case) since it can stop shifting early.'
        }
      ]
    },
    tags: ['bubble sort', 'selection sort', 'insertion sort', 'sorting']
  },
  {
    id: 'coding-q13-kadanes-algorithm',
    slideNumber: 58,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '13. Kadane\'s Algorithm (Maximum Subarray Sum)',
    slideSubtitle: 'Single-Pass Dynamic Programming: "Extend or Restart" Intuition',
    content: {
      paragraphs: [
        'Kadane\'s algorithm finds the maximum sum of a contiguous subarray in a single pass. The core idea: at each position, decide whether to extend the previous subarray or start a new one from the current element — whichever gives a larger sum.'
      ],
      codeBlocks: [
        {
          language: 'python',
          title: 'Kadane\'s Algorithm Code',
          code: `def max_subarray_sum(arr):
    max_ending_here = max_so_far = arr[0]
    for num in arr[1:]:
        max_ending_here = max(num, max_ending_here + num)
        max_so_far = max(max_so_far, max_ending_here)
    return max_so_far

# max_subarray_sum([-2, 1, -3, 4, -1, 2, 1, -5, 4]) → 6 (from [4, -1, 2, 1])`
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: 'Why it works',
          content: 'If max_ending_here ever drops below the current element\'s own value, carrying the previous sum forward can only hurt — so it\'s better to restart from num. That\'s the "extend or restart" intuition interviewers want to hear.\n\nComplexity: O(n) time, O(1) space — a major improvement over the brute-force O(n²) or O(n³) approaches of checking every subarray.'
        }
      ]
    },
    tags: ['kadane', 'max subarray sum', 'dynamic programming']
  },
  {
    id: 'coding-q14-prefix-sum',
    slideNumber: 59,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '14. Prefix Sum — Concept and Example Problem',
    slideSubtitle: 'Running Totals for O(1) Range Queries',
    content: {
      paragraphs: [
        'A prefix sum array stores running totals, so prefix[i] holds the sum of all elements from index 0 to i. Once built, the sum of any range [l, r] can be answered in O(1) instead of re-summing the range each time.'
      ],
      codeBlocks: [
        {
          language: 'python',
          title: 'Prefix Sum Code',
          code: `def build_prefix_sum(arr):
    prefix = [0] * (len(arr) + 1)
    for i in range(len(arr)):
        prefix[i + 1] = prefix[i] + arr[i]
    return prefix

def range_sum(prefix, l, r):
    # inclusive sum of arr[l..r]
    return prefix[r + 1] - prefix[l]`
        }
      ],
      callouts: [
        {
          type: 'priority',
          label: 'Example Problem & Complexity',
          content: 'Example problem: "Given an array and Q queries, each asking for the sum of a range [l, r], answer all queries efficiently." Without prefix sums, each query costs O(n), so Q queries cost O(n·Q). Building the prefix array once costs O(n), and each query then costs O(1), bringing the total down to O(n + Q).\n\nComplexity: O(n) to build, O(1) per range-sum query, O(n) extra space.\nRelated follow-up: extends to 2D grids (2D prefix sums) and prefix XOR/frequency maps.'
        }
      ]
    },
    tags: ['prefix sum', 'range query', 'running sum']
  },
  {
    id: 'coding-q15-second-highest-salary-logic',
    slideNumber: 60,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '15. Second Highest Salary — Logic (Without SQL)',
    slideSubtitle: 'Single-Pass Algorithmic Scan Across Array/List',
    content: {
      paragraphs: [
        'If given a list/array of salaries (rather than a database table), the same single-pass idea from question 3 applies directly — track the top two distinct values while scanning once:'
      ],
      codeBlocks: [
        {
          language: 'python',
          title: 'Second Highest Salary Logic',
          code: `def second_highest_salary(salaries):
    first = second = float('-inf')
    for s in salaries:
        if s > first:
            second = first
            first = s
        elif first > s > second:
            second = s
    return second if second != float('-inf') else None`
        }
      ],
      callouts: [
        {
          type: 'warning',
          label: '⚠️ Complexity & Gotchas',
          content: 'Complexity: O(n) time, O(1) space, single pass — no sorting required, which would cost O(n log n) instead.\n\nWatch for: duplicate salaries at the top (e.g. [90000, 90000, 75000] should return 75000, not 90000) and lists with fewer than 2 distinct salaries, which should return None/handle gracefully rather than crash. (SQL version is in Question 16 next).'
        }
      ]
    },
    tags: ['second highest salary', 'logic', 'single pass']
  },
  {
    id: 'coding-q16-second-highest-salary-sql',
    slideNumber: 61,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '16. Second Highest Salary (SQL)',
    slideSubtitle: 'Subquery, LIMIT/OFFSET & DENSE_RANK() Strategies',
    content: {
      codeBlocks: [
        {
          language: 'sql',
          title: '1. Using a subquery (most commonly expected)',
          code: `SELECT MAX(salary) AS second_highest_salary
FROM Employee
WHERE salary < (SELECT MAX(salary) FROM Employee);`
        },
        {
          language: 'sql',
          title: '2. Using LIMIT/OFFSET (works when duplicates aren\'t a concern)',
          code: `SELECT DISTINCT salary
FROM Employee
ORDER BY salary DESC
LIMIT 1 OFFSET 1;`
        },
        {
          language: 'sql',
          title: '3. Using DENSE_RANK() (generalizes to Nth highest)',
          code: `SELECT salary FROM (
    SELECT salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS rnk
    FROM Employee
) ranked
WHERE rnk = 2;`
        }
      ],
      callouts: [
        {
          type: 'warning',
          label: '⚠️ Watch for',
          content: 'Duplicate top salaries — the subquery and DENSE_RANK versions both handle that correctly by comparing values rather than row position; a plain LIMIT 1 OFFSET 1 without DISTINCT can return the same salary twice.'
        }
      ]
    },
    tags: ['second highest salary sql', 'subquery', 'dense_rank', 'limit offset']
  },
  {
    id: 'coding-q17-q18-highest-marks-update-empname',
    slideNumber: 62,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '17. Highest Marks Scored & 18. Update empname = \'XYZ\'',
    slideSubtitle: 'Aggregate Restrictions & Handling Duplicate Updates',
    content: {
      codeBlocks: [
        {
          language: 'sql',
          title: '17. Highest Marks Scored by a Student',
          code: `-- Just the score:
SELECT MAX(marks) AS highest_marks FROM Student;

-- Whole row (student name included):
SELECT * FROM Student ORDER BY marks DESC LIMIT 1;

-- If ties matter:
SELECT * FROM Student WHERE marks = (SELECT MAX(marks) FROM Student);`
        },
        {
          language: 'sql',
          title: '18. Update empname = \'XYZ\' to \'JKL\'',
          code: `-- If every XYZ should become JKL:
UPDATE Employee
SET empname = 'JKL'
WHERE empname = 'XYZ';

-- If only one specific duplicate row should change (by primary key):
UPDATE Employee
SET empname = 'JKL'
WHERE empname = 'XYZ' AND emp_id = 105;`
        }
      ],
      callouts: [
        {
          type: 'warning',
          label: '⚠️ Crucial Gotchas',
          content: '• Q17: ORDER BY ... LIMIT is O(n log n) due to sort; MAX() alone is a single O(n) pass. Aggregate functions cannot be used directly in WHERE without subqueries.\n• Q18 Gotcha: Classic gotcha question — "what if there are multiple employees named XYZ but I only want to rename one?" empname alone isn\'t a safe filter; you need a uniquely identifying column (primary key, employee ID) in the WHERE clause alongside it.'
        }
      ]
    },
    tags: ['highest marks', 'update', 'duplicates', 'where']
  },
  {
    id: 'coding-q19-q20-book-borrowers-student-course-join',
    slideNumber: 63,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '19. Books Starting with \'B\' & 20. Student-Course JOIN',
    slideSubtitle: 'Wildcard Pattern Matching & Junction Table Queries',
    content: {
      codeBlocks: [
        {
          language: 'sql',
          title: '19. Students Who Borrowed Books Where Book Name Starts with \'B\'',
          code: `SELECT DISTINCT s.name
FROM Student s
JOIN Borrow br ON s.student_id = br.student_id
JOIN Book b ON br.book_id = b.book_id
WHERE b.book_name LIKE 'B%';`
        },
        {
          language: 'sql',
          title: '20. JOIN — Student Names with Their Course Names',
          code: `-- Direct foreign key:
SELECT s.name AS student_name, c.course_name
FROM Student s
JOIN Course c ON s.course_id = c.course_id;

-- Multiple courses via junction table:
SELECT s.name AS student_name, c.course_name
FROM Student s
JOIN Enrollment e ON s.student_id = e.student_id
JOIN Course c ON e.course_id = c.course_id;`
        }
      ],
      callouts: [
        {
          type: 'warning',
          label: '⚠️ Interview Gotchas for Q19 & Q20',
          content: '• Q19: LIKE \'B%\' matches names starting with B; \'%B%\' matches B anywhere. DISTINCT matters here so borrowing 2 \'B\' books won\'t duplicate the student. LIKE is case-insensitive in MySQL but case-sensitive in PostgreSQL.\n• Q20: A plain JOIN defaults to INNER JOIN in standard SQL (only students with matching courses show up). To list students without any courses, use LEFT JOIN.'
        }
      ]
    },
    tags: ['like', 'wildcard', 'junction table', 'distinct']
  },
  {
    id: 'coding-q21-q22-avg-salary-where-having',
    slideNumber: 64,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '21. Above Average Salary & 22. WHERE vs HAVING',
    slideSubtitle: 'Subqueries & Row Filter vs Aggregated Group Filter',
    content: {
      codeBlocks: [
        {
          language: 'sql',
          title: '21. Employees Earning More Than the Average Salary',
          code: `-- Overall average:
SELECT name, salary
FROM Employee
WHERE salary > (SELECT AVG(salary) FROM Employee);

-- Follow-up: Per-department correlated subquery:
SELECT e.name
FROM Employee e
WHERE e.salary > (
    SELECT AVG(salary) FROM Employee e2 WHERE e2.department = e.department
);`
        },
        {
          language: 'sql',
          title: '22. WHERE vs HAVING',
          code: `-- WHERE filters rows before grouping:
SELECT department, salary
FROM Employee
WHERE salary > 50000;

-- HAVING filters groups after aggregation:
SELECT department, AVG(salary) AS avg_salary
FROM Employee
GROUP BY department
HAVING AVG(salary) > 50000;`
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: 'Key Distinction (WHERE vs HAVING)',
          content: 'WHERE operates on individual rows and runs before GROUP BY; it can\'t reference aggregate functions.\n\nHAVING operates on grouped results and runs after aggregation, so it\'s the only place you can filter on SUM(), AVG(), COUNT(), etc.\n\nInterviewers often ask you to combine both: WHERE to trim rows early (cheaper), HAVING to filter the resulting groups.'
        }
      ]
    },
    tags: ['average salary', 'where vs having', 'group by', 'aggregate']
  },
  {
    id: 'coding-q23-join-types-revisited',
    slideNumber: 65,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '23. INNER JOIN vs LEFT JOIN vs RIGHT JOIN',
    slideSubtitle: 'Side-by-Side Behavior with Orphaned Records & Swapping Rule',
    content: {
      codeBlocks: [
        {
          language: 'sql',
          title: 'Query Variations for Joins',
          code: `-- INNER JOIN: only rows with a match in both tables
SELECT e.name, d.department_name
FROM Employee e
INNER JOIN Department d ON e.department_id = d.id;

-- LEFT JOIN: all rows from the left table, matched from right (NULLs if no match)
SELECT e.name, d.department_name
FROM Employee e
LEFT JOIN Department d ON e.department_id = d.id;

-- RIGHT JOIN: all rows from the right table, matched from left (NULLs if no match)
SELECT e.name, d.department_name
FROM Employee e
RIGHT JOIN Department d ON e.department_id = d.id;`
        }
      ],
      callouts: [
        {
          type: 'priority',
          label: 'Practical Example & Interview Note',
          content: 'Practical example: if an employee\'s department_id doesn\'t match any row in Department (e.g. the department was deleted), INNER JOIN silently drops that employee from the results, LEFT JOIN keeps them with department_name as NULL, and RIGHT JOIN flips the direction — it keeps every department (even ones with zero employees) and fills name with NULL for departments that have nobody in them.\n\nInterview note: RIGHT JOIN is just a LEFT JOIN with the table order swapped — anything written with A RIGHT JOIN B can be rewritten as B LEFT JOIN A, which is why some teams avoid RIGHT JOIN entirely for readability.'
        }
      ]
    },
    tags: ['inner join', 'left join', 'right join', 'practical comparison']
  },
  {
    id: 'coding-q24-keys-explained',
    slideNumber: 66,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '24. Primary Key, Foreign Key, Unique Key',
    slideSubtitle: 'Definitions, Constraints & DDL Schema Declarations',
    content: {
      paragraphs: [
        '• Primary key — uniquely identifies each row in a table. Implicitly NOT NULL and unique; a table can have only one.',
        '• Foreign key — a column that references the primary key of another table, enforcing referential integrity (you can\'t insert a row pointing to a department that doesn\'t exist).',
        '• Unique key — enforces that all values in a column are distinct, like a primary key, but can hold a NULL (typically one, since most databases treat NULLs as distinct from each other) and a table can have several unique keys.'
      ],
      codeBlocks: [
        {
          language: 'sql',
          title: 'DDL Examples for Keys',
          code: `-- Primary Key:
CREATE TABLE Employee (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100)
);

-- Foreign Key:
CREATE TABLE Employee (
    emp_id INT PRIMARY KEY,
    name VARCHAR(100),
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES Department(id)
);

-- Unique Key:
CREATE TABLE Employee (
    emp_id INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE
);`
        }
      ],
      callouts: [
        {
          type: 'interview',
          label: '🎯 Interview Summary',
          content: 'Primary key = one per table, no nulls, identifies the row.\nForeign key = links to another table\'s primary key, enforces valid relationships.\nUnique key = enforces distinctness like a primary key but allows a null and allows multiple per table.'
        }
      ]
    },
    tags: ['primary key', 'foreign key', 'unique key', 'constraints']
  },
  {
    id: 'coding-q25-normalization',
    slideNumber: 67,
    sectionId: 'coding_dsa',
    sectionTitle: '06 — CODING, DSA & SQL ANSWERS',
    slideTitle: '25. Normalization — 1NF, 2NF, 3NF',
    slideSubtitle: 'Atomic Values, Partial Dependencies & Transitive Dependencies',
    content: {
      paragraphs: [
        'Normalization is the process of structuring tables to reduce data redundancy and avoid update/insert/delete anomalies, typically by splitting data into related tables.'
      ],
      tables: [
        {
          title: '1NF: Atomic Values (No multi-valued cells)',
          headers: ['StudentID', 'Name', 'PhoneNumbers (Violates 1NF)'],
          rows: [
            ['1', 'Asha', '"9876543210, 9123456780"']
          ]
        },
        {
          title: 'Satisfies 1NF: One phone number per row',
          headers: ['StudentID', 'Name', 'PhoneNumber'],
          rows: [
            ['1', 'Asha', '9876543210'],
            ['1', 'Asha', '9123456780']
          ]
        }
      ],
      callouts: [
        {
          type: 'priority',
          label: '2NF & 3NF Rules & Schema Splits',
          content: '• 2NF (Second Normal Form): Must be in 1NF, and every non-key column must depend on the whole primary key (removes partial dependencies in composite keys).\nViolates 2NF: StudentID | CourseID | StudentName | CourseName\nSatisfies 2NF: Student(StudentID, StudentName), Enrollment(StudentID, CourseID, CourseName)\n\n• 3NF (Third Normal Form): Must be in 2NF, and every non-key column must depend only on the primary key (no transitive dependencies).\nViolates 3NF: StudentID | ZipCode | City (ZipCode determines City)\nSatisfies 3NF: Student(StudentID, ZipCode), ZipCityLookup(ZipCode, City)'
        },
        {
          type: 'tip',
          label: '💡 Interview Tip',
          content: 'The one-line distinction interviewers listen for — 2NF removes partial dependencies (a column depending on only part of a composite key), while 3NF removes transitive dependencies (a column depending on another non-key column instead of the key itself). Each level assumes all the ones before it are already satisfied.'
        }
      ]
    },
    tags: ['normalization', '1nf', '2nf', '3nf', 'dependencies']
  }
];
