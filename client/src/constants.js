export const LANGUAGE_VERSIONS = {
  javascript: "18.15.0",
  typescript: "5.0.3",
  python: "3.10.0",
  java: "15.0.2",
  csharp: "6.12.0",
  php: "8.2.3",
  cpp : "10.2.0" 
};

export const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "java",
  "csharp",
  "php",
  "cpp"
];


export const CODE_SNIPPETS = {
  javascript: `\nfunction greet(name) {\n\tconsole.log("Hello, " + name + "!");\n}\n\ngreet("Alex");\n`,
  typescript: `\ntype Params = {\n\tname: string;\n}\n\nfunction greet(data: Params) {\n\tconsole.log("Hello, " + data.name + "!");\n}\n\ngreet({ name: "Alex" });\n`,
  python: `\ndef greet(name):\n\tprint("Hello, " + name + "!")\n\ngreet("Alex")\n`,
  java: `\npublic class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println("Hello World");\n\t}\n}\n`,
  csharp:
    'using System;\n\nnamespace HelloWorld\n{\n\tclass Hello { \n\t\tstatic void Main(string[] args) {\n\t\t\tConsole.WriteLine("Hello World in C#");\n\t\t}\n\t}\n}\n',
  php: "<?php\n\n$name = 'Alex';\necho $name;\n",
};


export const columnsAssignments = [
  {
    title: "S.No",
    dataIndex: "serial",
    width : 150,
  },
  {
    title: "Title",
    dataIndex: "title",
  },
  {
    title: "Difficulty",
    dataIndex: "difficulty",
    width : 200
    //   sorter: {
    //     compare: (a, b) => a.chinese - b.chinese,
    //     multiple: 3,
    //   },
  },
  {
    title: "Tags",
    dataIndex: "tags",
    width : 200
  },
  {
    title: "Submissions",
    dataIndex: "submissions",
    width : 200
    //   sorter: {
    //     compare: (a, b) => a.math - b.math,
    //     multiple: 2,
    //   },
  },
  // {
  //   title: 'English Score',
  //   dataIndex: 'english',
  //   sorter: {
  //     compare: (a, b) => a.english - b.english,
  //     multiple: 1,
  //   },
  // },
];
export const columnsStudent = [
  {
    title: "S.No",
    dataIndex: "serial",
    width : 150,
  },
  {
    title: "Name",
    dataIndex: "name",
    width : 300
  },
  {
    title: "Email",
    dataIndex: "email",
    width : 300
    //   sorter: {
    //     compare: (a, b) => a.chinese - b.chinese,
    //     multiple: 3,
    //   },
  },
  {
    title: "Action",
    dataIndex: "action",
    width : 150
  },
  {
    title: "Online",
    dataIndex: "isOnline",
    width : 150
    //   sorter: {
    //     compare: (a, b) => a.math - b.math,
    //     multiple: 2,
    //   },
  },
  // {
  //   title: 'English Score',
  //   dataIndex: 'english',
  //   sorter: {
  //     compare: (a, b) => a.english - b.english,
  //     multiple: 1,
  //   },
  // },
];

export const columnSubmissions = [
  {
    title: "S.No",
    dataIndex: "serial",
    width : 150,
  },
  {
    title: "Name",
    dataIndex: "name",
    width : 300
  },
  {
    title: "Assignment title",
    dataIndex: "title",
    width : 300
    //   sorter: {
    //     compare: (a, b) => a.chinese - b.chinese,
    //     multiple: 3,
    //   },
  },
  {
    title: "Action",
    dataIndex: "action",
    width : 150
  },
  {
    title: "Marks",
    dataIndex: "marks",
    width : 150
    //   sorter: {
    //     compare: (a, b) => a.math - b.math,
    //     multiple: 2,
    //   },
  },
  // {
  //   title: 'English Score',
  //   dataIndex: 'english',
  //   sorter: {
  //     compare: (a, b) => a.english - b.english,
  //     multiple: 1,
  //   },
  // },
];