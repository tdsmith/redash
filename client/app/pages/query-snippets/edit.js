import 'brace/mode/snippets';
import template from './edit.html';

function SnippetCtrl($routeParams, $http, $location, toastr, currentUser, AlertDialog, Events, QuerySnippet) {
  this.snippetId = $routeParams.snippetId;

  this.editorOptions = {
    mode: 'snippets',
    advanced: {
      behavioursEnabled: true,
      enableSnippets: false,
      autoScrollEditorIntoView: true,
    },
    onLoad(editor) {
      editor.$blockScrolling = Infinity;
      editor.getSession().setUseWrapMode(true);
      editor.setShowPrintMargin(false);
    },
  };

  this.saveChanges = () => {
    this.snippet.$save((snippet) => {
      toastr.success('Saved.');
      if (this.snippetId === 'new') {
        $location.path(`/query_snippets/${snippet.id}`).replace();
      }
    }, () => {
      toastr.error('Failed saving snippet.');
    });
  };

  this.delete = () => {
    const doDelete = () => {
      this.snippet.$delete(() => {
        $location.path('/query_snippets');
        toastr.success('Query snippet deleted.');
      }, () => {
        toastr.error('Failed deleting query snippet.');
      });
    };

    const title = 'Delete Snippet';
    const message = `Are you sure you want to delete the "${this.snippet.trigger}" snippet?`;
    const confirm = { class: 'btn-warning', title: 'Delete' };

    AlertDialog.open(title, message, confirm).then(doDelete);
  };

  if (this.snippetId === 'new') {
    this.snippet = new QuerySnippet({ description: '' });
    this.canEdit = true;
  } else {
    this.snippet = QuerySnippet.get({ id: this.snippetId }, (snippet) => {
      this.canEdit = currentUser.canEdit(snippet);
    });
  }
}

export default function init(ngModule) {
  ngModule.component('snippetPage', {
    template,
    controller: SnippetCtrl,
  });

  return {
    '/query_snippets/:snippetId': {
      template: '<snippet-page></snippet-page>',
      title: 'Query Snippets',
    },
  };
}
