import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import PostList from './components/PostList';
import PostSave from './components/PostSave';
import PostUpdate from './components/PostUpdate';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '');

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <main className="container">
        <Routes>
          <Route path="/" element={<PostList />} />
          <Route path="/posts/save" element={<PostSave />} />
          <Route path="/posts/update/:id" element={<PostUpdate />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
