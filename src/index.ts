import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';
import { Widget } from '@lumino/widgets';
import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';
// import { IMainMenu } from '@jupyterlab/mainmenu';
// import { DocumentRegistry } from '@jupyterlab/docregistry';

const extension: JupyterFrontEndPlugin<void> = {
  id: 'autograder-extension',
  autoStart: true,
  requires: [ICommandPalette],
  activate: (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension autograder-extension is activated!');

    // Create the widget that will hold the code input form
    const content = new Widget();
    const widget = new MainAreaWidget({ content });
    widget.id = 'autograder-jupyterlab';
    widget.title.label = 'Autograder';
    widget.title.closable = true;

    // Create the code input form
    const codeTextarea = document.createElement('textarea');
    codeTextarea.rows = 20;
    codeTextarea.cols = 80;
    codeTextarea.placeholder = 'Enter your code here';

    // Add the code input form to the widget
    content.node.appendChild(codeTextarea);

    // Create a button to submit the code and run the tests
    const submitButton = document.createElement('button');
    submitButton.innerText = 'Submit';
    submitButton.textContent = 'Submit';
    content.node.appendChild(submitButton);
    
    submitButton.onclick = async () => {
      // Get the code from the input form
      const code = codeTextarea.value;

      // Call the autograding service to run the tests
      const response = await fetch('http://localhost:8000/autograder/run', {
        method: 'POST',
        body: JSON.stringify({ code }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Parse the response JSON
      // result is in the format { grade: 0.5, message: 'Test 1 passed\nTest 2 failed' }
      const result = await response.json();

      // Display the results of the tests in a new panel
      const resultsPanelcontext = new Widget();
      const resultsPanel = new MainAreaWidget({ content: resultsPanelcontext });

      resultsPanelcontext.id = 'results-panel';
      resultsPanel.title.label = 'Results';
      resultsPanel.title.closable = true;
      const resultTextarea = document.createElement('textarea');
      resultTextarea.rows = 20;
      resultTextarea.cols = 80;
      resultTextarea.value = "0.5";
      resultTextarea.readOnly = true;
      resultsPanelcontext.node.appendChild(resultTextarea);

      app.shell.add(resultsPanel, 'main', { rank: 100 });     
    };

    // Create a button to clear the code input form
    const clearButton = document.createElement('button');
    clearButton.innerText = 'Clear';
    clearButton.textContent = 'Clear';
    content.node.appendChild(clearButton);

    clearButton.onclick = () => {
      codeTextarea.value = '';
    };

    // Add the code input panel to the main area of JupyterLab
    app.shell.add(widget, 'main', { rank: 100 });

    // Add a command to show the code input panel
    const commandId = 'autograder-extension:show-panel';
    app.commands.addCommand(commandId, {
      label: 'Autograder',
      execute: () => {
        app.shell.add(widget, 'main', { rank: 100 });
      }
    });

    // Add the command to the command palette
    palette.addItem({ command: commandId, category: 'Extensions' });
  }
};

export default extension;
