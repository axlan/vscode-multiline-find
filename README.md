# vscode-multiline-find
Multiline find and replace extension for Visual Studio Code

# Todos

There are a few aproaches one could take to add this functionality. In order of simplest to most complicated:

1. Add a new command set to support all the find and replace operations in parallel to the normal VSCode find/replace exept it allows multiple lines and has no GUI.
2. Add a command to translate multiline selections to a sanitized regular expresion that fill in the standard find widget using `actions.findWithSelection` and `toggleFindRegex` (Can't autofill replace would probably need mechanism to add regexed selection to copy buffer). This has the disadvantage that it would likely interfere with the document history or the copy buffer, or cause some jumpy action as the selection changes.
3. Option 1, but also build a GUI by openning a new editor window(s) for the find and replace options. Probably better to use a single editor, with some forced split, but that would be more complicated. See https://github.com/stef-levesque/vscode-hexdump
4. Option 1, but also build a GUI using a html view. See https://github.com/Microsoft/vscode/issues/1833#issuecomment-175074966 , or https://github.com/zikalino/vsc-docker

I'm going to start by providing an easy way to copy multiple lines as a regex and think about adding some of the other elements later.