import { Slide } from '../types';

export const slidesOOP: Slide[] = [
  {
    id: 'oop-divider',
    slideNumber: 8,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideSubtitle: 'Theory → Real-life Example → Python Code → Ready-to-say Interview Answer',
    isDivider: true,
    content: {
      paragraphs: [
        'Complete walkthrough of Object-Oriented Programming principles tailored for the TCS Ignite technical interview.',
        'Covers Encapsulation, Inheritance, Polymorphism (Overloading & Overriding), Abstraction, Constructors, Combined 4-pillar example, Quick Revision Table, Cheat-sheet, and Likely Follow-Up Questions.'
      ],
      keyNotes: [
        '10 comprehensive topics formatted with exact Python syntax and real-life analogies',
        'Includes memory tricks and exact interview-ready one-liners'
      ]
    },
    tags: ['oop', 'python', 'classes', 'objects', 'pillars']
  },
  {
    id: 'oop-intro',
    slideNumber: 9,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '1. What is OOP?',
    slideSubtitle: 'Definition, Four Pillars & Real-Life Car Analogy',
    content: {
      paragraphs: [
        'OOP (Object-Oriented Programming) is a programming approach where a program is designed using classes and objects.',
        'The four main principles of OOP:',
        '• Encapsulation',
        '• Inheritance',
        '• Polymorphism',
        '• Abstraction'
      ],
      tables: [
        {
          title: 'Real-life analogy — Car 🚗',
          headers: ['Concept', 'Car analogy'],
          rows: [
            ['Class', 'Car blueprint'],
            ['Object', 'Your actual BMW'],
            ['Properties', 'color, model, speed'],
            ['Methods', 'start(), stop(), accelerate()']
          ]
        }
      ]
    },
    tags: ['oop', 'class', 'object', 'car analogy']
  },
  {
    id: 'oop-encapsulation',
    slideNumber: 10,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '2. Encapsulation 🔒',
    slideSubtitle: 'Data Hiding, ATM Analogy & Private Attributes in Python',
    content: {
      paragraphs: [
        'Theory: Encapsulation is the process of wrapping data and methods together inside a class and restricting direct access to the data.',
        'In simple words: Keep data safe, allow access only through methods.'
      ],
      callouts: [
        {
          type: 'analogy',
          label: 'Real-life example — ATM 💳',
          content: 'You can\'t directly touch the money inside the bank\'s system. You can only interact through withdraw(), deposit(), check_balance(). The internal data stays protected.'
        },
        {
          type: 'interview',
          label: '🎯 Interview answer',
          content: '“Encapsulation is the process of wrapping data and methods into a single class and restricting direct access to the data.”'
        }
      ],
      codeBlocks: [
        {
          language: 'python',
          title: 'Python code — BankAccount',
          code: `class BankAccount:
    def __init__(self):
        self.__balance = 0   # double underscore = name-mangled "private"

    def deposit(self, amount):
        self.__balance += amount

    def get_balance(self):
        return self.__balance`,
          output: 'self.__balance uses Python\'s name-mangling convention (double leading underscore) — the closest thing Python has to private. Outside code shouldn\'t touch it directly; it should go through deposit() and get_balance().'
        }
      ]
    },
    tags: ['encapsulation', 'private', '__balance', 'atm']
  },
  {
    id: 'oop-inheritance',
    slideNumber: 11,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '3. Inheritance ♻️',
    slideSubtitle: 'Code Reusability, Parent-Child Relationship & Method Reuse',
    content: {
      paragraphs: [
        'Theory: Inheritance is a mechanism where one class acquires the properties and methods of another class. It mainly helps with code reusability.',
        'In simple words: A child class can reuse features of a parent class.'
      ],
      callouts: [
        {
          type: 'analogy',
          label: 'Real-life example',
          content: 'Parent → Child. A child inherits characteristics from the parent — same idea as Animal → Dog.'
        },
        {
          type: 'interview',
          label: '🎯 Interview answer',
          content: '“Inheritance is an OOP concept where one class acquires the properties and methods of another class. It helps achieve code reusability.”'
        }
      ],
      codeBlocks: [
        {
          language: 'python',
          title: 'Python code — Animal & Dog',
          code: `class Animal:
    def eat(self):
        print("Animal eats")

class Dog(Animal):
    def bark(self):
        print("Dog barks")

d = Dog()
d.eat()   # inherited from Animal
d.bark()  # Dog's own method`,
          output: `Animal eats
Dog barks`
        }
      ]
    },
    tags: ['inheritance', 'reusability', 'animal', 'dog']
  },
  {
    id: 'oop-polymorphism-overview',
    slideNumber: 12,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '4. Polymorphism 🔄 — Overview & Taxonomy',
    slideSubtitle: 'One Name Having Many Forms',
    content: {
      paragraphs: [
        'Theory: Polymorphism means one name having many forms — the same method or operation behaves differently depending on the situation.'
      ],
      diagram: `Polymorphism
│
├── Compile-time → Method Overloading
│
└── Runtime      → Method Overriding`,
      keyNotes: [
        'Compile-time polymorphism in standard OOP is represented by Method Overloading.',
        'Runtime polymorphism is represented by Method Overriding.'
      ]
    },
    tags: ['polymorphism', 'compile-time', 'runtime']
  },
  {
    id: 'oop-method-overloading',
    slideNumber: 13,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '4a. Method Overloading (Compile-time)',
    slideSubtitle: 'Same Method Name, Different Parameters & Python Behavior',
    content: {
      paragraphs: [
        'Theory: Same method name, different parameters, usually in the same class.',
        'Example: Arun can add 2 numbers or 3 numbers — same action name, different inputs.'
      ],
      callouts: [
        {
          type: 'warning',
          label: '⚠️ Note on Python',
          content: 'Python doesn\'t support true method overloading like Java — defining two methods with the same name just replaces the first one. The usual workaround is default parameters (or *args), as below.'
        },
        {
          type: 'priority',
          label: '⭐ Important (theory, still asked as-is in interviews)',
          content: 'Overloading is defined by:\n• Number of parameters\n• Type of parameters\n• Order of parameters\n\n❌ Changing only the return type is not overloading.'
        }
      ],
      codeBlocks: [
        {
          language: 'python',
          title: 'Python code — Calculator',
          code: `class Calculator:
    def add(self, a, b, c=0):
        return a + b + c

c = Calculator()
print(c.add(10, 20))       # 30
print(c.add(10, 20, 30))   # 60`,
          output: `30
60`
        }
      ]
    },
    tags: ['overloading', 'parameters', 'compile-time']
  },
  {
    id: 'oop-method-overriding',
    slideNumber: 14,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '4b. Method Overriding (Runtime)',
    slideSubtitle: 'Child Class Replaces Parent Implementation',
    content: {
      paragraphs: [
        'Theory: A child class provides its own implementation of a method already defined in the parent class.',
        'Example: Animal says "makes sound," Dog overrides it with "bark," Cat overrides it with "meow."'
      ],
      codeBlocks: [
        {
          language: 'python',
          title: 'Python code — Animal, Dog, Cat',
          code: `class Animal:
    def sound(self):
        print("Animal makes sound")

class Dog(Animal):
    def sound(self):
        print("Dog barks")

class Cat(Animal):
    def sound(self):
        print("Cat meows")

a1 = Dog()
a2 = Cat()
a1.sound()   # Dog barks
a2.sound()   # Cat meows`,
          output: `Dog barks
Cat meows`
        }
      ],
      keyNotes: [
        'Calling .sound() on different subclass instances and getting each one\'s own behavior is exactly what interviewers mean by "runtime polymorphism" — worth mentioning if asked to elaborate.'
      ]
    },
    tags: ['overriding', 'runtime polymorphism', 'sound']
  },
  {
    id: 'oop-overloading-vs-overriding',
    slideNumber: 15,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '4c. Overloading vs Overriding ⚔️',
    slideSubtitle: 'Direct Feature Comparison & Memory Trick',
    content: {
      tables: [
        {
          headers: ['Overloading', 'Overriding'],
          rows: [
            ['Same class, usually', 'Parent + child class'],
            ['Same method name', 'Same method name'],
            ['Different parameters', 'Same parameters'],
            ['Compile-time (concept; Python has no true overloading)', 'Runtime'],
            ['Inheritance not required', 'Inheritance required'],
            ['Example: add()', 'Example: sound()']
          ]
        }
      ],
      callouts: [
        {
          type: 'remember',
          label: '🧠 Memory trick',
          content: '• Overloading = Same name, different inputs\n• Overriding = Child changes parent\'s behavior'
        }
      ]
    },
    tags: ['overloading vs overriding', 'comparison', 'memory trick']
  },
  {
    id: 'oop-abstraction',
    slideNumber: 16,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '5. Abstraction 🎭',
    slideSubtitle: 'Hiding Details, Showing Essential Functionality & ABC Module',
    content: {
      paragraphs: [
        'Theory: Abstraction is the process of hiding implementation details and showing only the essential functionality to the user.',
        'In simple words: Show what an object does, hide how it does it.'
      ],
      callouts: [
        {
          type: 'analogy',
          label: 'Real-life example — Driving a car 🚗',
          content: 'You use start(), accelerate(), brake() without knowing exactly how the engine works internally.'
        },
        {
          type: 'interview',
          label: '🎯 Interview answer',
          content: '“Abstraction means hiding the internal implementation details and showing only the necessary functionality to the user.”'
        }
      ],
      codeBlocks: [
        {
          language: 'python',
          title: 'Python code (abstract class via abc)',
          code: `from abc import ABC, abstractmethod

class Animal(ABC):
    @abstractmethod
    def sound(self):
        pass

    def eat(self):
        print("Animal eats")

class Dog(Animal):
    def sound(self):
        print("Dog barks")`,
          output: 'You don\'t need to know how sound() will be implemented inside Animal — each child class fills that in. (Trying to create Animal() directly would raise a TypeError, since it still has an unimplemented abstract method.)'
        }
      ]
    },
    tags: ['abstraction', 'abc', 'abstractmethod']
  },
  {
    id: 'oop-constructor',
    slideNumber: 17,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '6. Constructor 🏗️',
    slideSubtitle: 'Initialization with __init__, Rules & Constructor Types',
    content: {
      paragraphs: [
        'Theory: A constructor is a special member of a class used to initialize an object. In Python it\'s the __init__ method, and it\'s called automatically when an object is created.',
        'Rules (Python):',
        '• Defined as __init__ — not named after the class, unlike Java/C++',
        '• Implicitly returns None',
        '• Called automatically when you instantiate the class: Student()',
        '• Mainly used to initialize object data'
      ],
      codeBlocks: [
        {
          language: 'python',
          title: 'Python code — Basic & Types of Constructors',
          code: `# 1. Default / no-argument constructor
class Student:
    def __init__(self):
        self.name = "Ari"
        print("Constructor called")

s = Student()
print(s.name)   # Ari

# 2. Parameterized constructor
class StudentWithParams:
    def __init__(self, n, a):
        self.name = n
        self.age = a

s2 = StudentWithParams("Ari", 21)`
        }
      ],
      callouts: [
        {
          type: 'interview',
          label: '🎯 Interview answer',
          content: '“A constructor is a special method used to initialize an object. In Python it\'s __init__ — it has no return type and is automatically called when an object is created.”'
        }
      ]
    },
    tags: ['constructor', '__init__', 'parameterized', 'default']
  },
  {
    id: 'oop-all-4-pillars',
    slideNumber: 18,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '7. All 4 Pillars — One Example',
    slideSubtitle: 'Animal Hierarchy Unified Demonstrating Encapsulation, Inheritance, Polymorphism & Abstraction',
    content: {
      diagram: `           Animal
             │
       ┌─────┴─────┐
       ↓           ↓
     Dog          Cat`,
      tables: [
        {
          headers: ['Pillar', 'In this hierarchy'],
          rows: [
            ['🔒 Encapsulation', 'self.__name — data name-mangled as private inside each class'],
            ['♻️ Inheritance', 'class Dog(Animal), class Cat(Animal)'],
            ['🔄 Polymorphism', 'Dog → bark(), Cat → meow() — same sound() call, different behavior'],
            ['🎭 Abstraction', 'Caller only knows sound() exists, not how each animal makes it']
          ]
        }
      ]
    },
    tags: ['4 pillars', 'hierarchy', 'unified example']
  },
  {
    id: 'oop-quick-revision-table',
    slideNumber: 19,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '8. Quick Revision Table 🔥',
    slideSubtitle: 'One-Line Theory Summary for Rapid Recall',
    content: {
      tables: [
        {
          headers: ['Topic', 'One-line Theory'],
          rows: [
            ['OOP', 'Programming approach based on classes and objects'],
            ['Encapsulation', 'Protect and control access to data'],
            ['Inheritance', 'Acquire properties and methods from another class'],
            ['Polymorphism', 'One name having many forms'],
            ['Overloading', 'Same method name, different parameters'],
            ['Overriding', 'Child class changes parent\'s method implementation'],
            ['Abstraction', 'Hide implementation details'],
            ['Constructor', 'Initializes an object when it is created']
          ]
        }
      ]
    },
    tags: ['quick revision', 'revision table', 'summary']
  },
  {
    id: 'oop-interview-cheat-sheet',
    slideNumber: 20,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '9. Interview Answer Cheat-Sheet 🎯',
    slideSubtitle: 'Exact Verbal Answers & One-Line Revision Block',
    content: {
      callouts: [
        {
          type: 'interview',
          label: '“What are the four pillars of OOP?”',
          content: '“The four pillars of OOP are Encapsulation, Inheritance, Polymorphism, and Abstraction. Encapsulation protects data, Inheritance provides code reusability, Polymorphism allows one interface to have multiple forms, and Abstraction hides implementation details.”'
        },
        {
          type: 'interview',
          label: '“What is overloading?”',
          content: '“Method overloading means having multiple methods with the same name but different parameters. It is compile-time polymorphism.”'
        },
        {
          type: 'interview',
          label: '“What is overriding?”',
          content: '“Method overriding occurs when a child class provides its own implementation of a method already defined in the parent class. It is runtime polymorphism.”'
        },
        {
          type: 'interview',
          label: '“What is a constructor?”',
          content: '“A constructor is a special method used to initialize an object. It has no return type and is automatically called when an object is created.”'
        },
        {
          type: 'remember',
          label: '🧠 One-line revision',
          content: 'Encapsulation → Protect data 🔒\nInheritance   → Reuse code ♻️\nPolymorphism  → Many forms 🔄\nAbstraction   → Hide details 🎭\nConstructor   → Initialize object 🏗️\nOverloading   → Same name + different parameters\nOverriding    → Child changes parent\'s method'
        }
      ]
    },
    tags: ['cheat sheet', 'verbal answers', 'one-line revision']
  },
  {
    id: 'oop-follow-ups-1',
    slideNumber: 21,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '10. Bonus: Likely Follow-Up Questions (Part 1)',
    slideSubtitle: 'In-Depth OOP Edge Cases Asked by TCS Interviewers',
    content: {
      paragraphs: [
        'Not in your original notes, but these tend to come up right after the topics above — worth having a one-liner ready:'
      ],
      callouts: [
        {
          type: 'interview',
          label: '• Abstract Base Class vs "interface"?',
          content: 'Python has no formal interface keyword. An ABC (abc module) can mix implemented and unimplemented methods, similar to Java\'s abstract class; Python more often relies on duck typing — if an object has the right methods, it can be used, no formal contract needed.'
        },
        {
          type: 'interview',
          label: '• Can __init__ be made private, like a private constructor?',
          content: 'Python doesn\'t enforce access modifiers at all (just naming conventions). To control instance creation (e.g. Singleton pattern), Python code usually overrides __new__ instead.'
        },
        {
          type: 'interview',
          label: '• Is __init__ inherited?',
          content: 'Yes — if a subclass doesn\'t define its own __init__, it automatically uses the parent\'s. If it does define one, call super().__init__() to still run the parent\'s setup.'
        }
      ]
    },
    tags: ['follow-up', 'abc', '__init__', 'super']
  },
  {
    id: 'oop-follow-ups-2',
    slideNumber: 22,
    sectionId: 'oop',
    sectionTitle: '02 — OOP INTERVIEW STUDY GUIDE',
    slideTitle: '10. Bonus: Likely Follow-Up Questions (Part 2)',
    slideSubtitle: 'Execution Entry Point & Static Method Resolution in Python',
    content: {
      callouts: [
        {
          type: 'interview',
          label: '• Does Python require a main() method?',
          content: 'No — Python has no forced entry point; code runs top to bottom. The if __name__ == "__main__": guard is just a convention for "only run this when the file is executed directly."'
        },
        {
          type: 'interview',
          label: '• Can static methods be overridden in Python?',
          content: 'Yes, more freely than in Java — Python resolves all method calls dynamically at runtime through the class\'s MRO (method resolution order), so a subclass redefining a @staticmethod really does override it when called on that subclass.'
        }
      ]
    },
    tags: ['follow-up', 'main', 'static methods', 'mro']
  }
];
