// RichEditor
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

function RichEditor({ articleContent }) {
  return (
    <div className="App">
      {articleContent !== undefined ? (
        <CKEditor
          editor={ClassicEditor}
          data={articleContent}
          onReady={(editor) => {
            // You can store the "editor" and use when it is needed.
            console.log("Editor is ready to use!", editor);
          }}
          onChange={(event) => {
            console.log(event);
          }}
          onBlur={(event, editor) => {
            console.log("Blur.", editor);
          }}
          onFocus={(event, editor) => {
            console.log("Focus.", editor);
          }}
        />
      ) : (
        <p>No article content available</p>
      )}
    </div>
  );
}

export default RichEditor;
