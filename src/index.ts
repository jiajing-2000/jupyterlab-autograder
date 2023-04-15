import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the autograder-extension extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'autograder-extension:plugin',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension autograder-extension is activated!');
  }
};

export default plugin;
