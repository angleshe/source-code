module.exports = {
  types: [
    { value: 'feat', name: 'feat:     新增一个功能' },
    { value: 'fix', name: 'fix:      修复一个Bug' },
    { value: 'docs', name: 'docs:     文档变更' },
    {
      value: 'style',
      name: 'style:    代码格式\n            （不影响功能，例如空格、分号等格式修正）'
    },
    { value: 'refactor', name: 'refactor: 代码重构' },
    { value: 'perf', name: 'perf:     改善性能' },
    { value: 'test', name: 'test:     测试' },
    {
      value: 'build',
      name: 'build:    变更项目构建或外部依赖\n            （例如scopes: webpack、gulp、npm等）'
    },
    {
      value: 'ci',
      name:
        'ci:       更改持续集成软件的配置文件和package中的scripts命令，例如scopes: Travis, Circle等'
    },
    { value: 'chore', name: 'chore:    变更构建流程或辅助工具' },
    { value: 'revert', name: 'revert:   代码回退' }
  ],

  // scopes: [
  //   {name: 'accounts'},
  //   {name: 'admin'},
  //   {name: 'exampleScope'},
  //   {name: 'changeMe'}
  // ],

  // it needs to match the value for field type. Eg.: 'fix'
  /*
  scopeOverrides: {
    fix: [
      {name: 'merge'},
      {name: 'style'},
      {name: 'e2eTest'},
      {name: 'unitTest'}
    ]
  },
  */
  // override the messages, defaults are as follows
  messages: {
    type: '选择一种你的提交类型:',
    scope: '选择一个scope (可选):',
    // used if allowCustomScopes is true
    customScope: '表示本次变更的范围:',
    subject: '短说明:\n',
    body: '长说明，使用"|"换行(可选)：\n',
    breaking: '非兼容性说明 (可选):\n',
    footer: '关联关闭的issue，例如：#31, #34(可选):\n',
    confirmCommit: '确定提交说明?'
  },

  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix'],

  // limit subject length
  subjectLimit: 100
};
