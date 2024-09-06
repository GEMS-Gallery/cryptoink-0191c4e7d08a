import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Box } from '@mui/material';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

interface NewPostFormProps {
  onSubmit: (title: string, body: string, author: string) => void;
  onCancel: () => void;
}

const NewPostForm: React.FC<NewPostFormProps> = ({ onSubmit, onCancel }) => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  const onSubmitForm = (data: any) => {
    const htmlBody = draftToHtml(convertToRaw(data.body.getCurrentContent()));
    onSubmit(data.title, htmlBody, data.author);
  };

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
      <Controller
        name="title"
        control={control}
        defaultValue=""
        rules={{ required: 'Title is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Title"
            fullWidth
            margin="normal"
            error={!!errors.title}
            helperText={errors.title?.message as string}
          />
        )}
      />
      <Controller
        name="body"
        control={control}
        defaultValue={EditorState.createEmpty()}
        rules={{ required: 'Body is required' }}
        render={({ field }) => (
          <Box sx={{ mb: 2 }}>
            <Editor
              editorState={field.value}
              onEditorStateChange={field.onChange}
              wrapperClassName="wrapper-class"
              editorClassName="editor-class"
              toolbarClassName="toolbar-class"
            />
            {errors.body && (
              <Typography color="error" variant="caption">
                {errors.body.message as string}
              </Typography>
            )}
          </Box>
        )}
      />
      <Controller
        name="author"
        control={control}
        defaultValue=""
        rules={{ required: 'Author is required' }}
        render={({ field }) => (
          <TextField
            {...field}
            label="Author"
            fullWidth
            margin="normal"
            error={!!errors.author}
            helperText={errors.author?.message as string}
          />
        )}
      />
      <Box sx={{ mt: 2 }}>
        <Button type="submit" variant="contained" color="primary" sx={{ mr: 1 }}>
          Submit
        </Button>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
      </Box>
    </form>
  );
};

export default NewPostForm;
