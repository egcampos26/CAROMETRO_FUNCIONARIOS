
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import ShiftSelection from './pages/ShiftSelection';
import ClassSelection from './pages/ClassSelection';
import CarometroGallery from './pages/CarometroGallery';
import FuncionarioDetail from './pages/FuncionarioDetail';
import FuncionarioEdit from './pages/FuncionarioEdit';
import OccurrencesList from './pages/OccurrencesList';
import OccurrenceAdd from './pages/OccurrenceAdd';
import OccurrenceAddMulti from './pages/OccurrenceAddMulti';
import OccurrenceDetail from './pages/OccurrenceDetail';
import { Funcionario, Occurrence, AuthUser } from './types';
import { supabase } from './supabase';

// Mock user for standalone testing (Portal will provide user when integrated)
const MOCK_USER: AuthUser = {
  id: 'portal-user',
  name: 'Usuário Portal',
  role: 'Admin',
  email: 'portal@sme.prefeitura.sp.gov.br'
};

const App: React.FC = () => {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [occurrences, setOccurrences] = useState<Occurrence[]>(() => {
    const saved = localStorage.getItem('carometro_occurrences');
    return saved ? JSON.parse(saved) : [];
  });

  // Fetch officials from Supabase on mount
  useEffect(() => {
    const fetchOfficials = async () => {
      const { data, error } = await supabase
        .from('FUNCIONARIOS')
        .select('*');

      if (error) {
        console.error('Error fetching officials:', error);
      } else if (data) {
        setFuncionarios(data as unknown as Funcionario[]);
      }
    };

    fetchOfficials();
  }, []);

  useEffect(() => {
    localStorage.setItem('carometro_occurrences', JSON.stringify(occurrences));
  }, [occurrences]);

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string): Blob => {
    const parts = base64.split(';base64,');
    const contentType = parts[0].split(':')[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;
    const uInt8Array = new Uint8Array(rawLength);
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }
    return new Blob([uInt8Array], { type: contentType });
  };

  // Helper function to upload photo to Supabase Storage
  const uploadPhoto = async (base64Photo: string, funcionarioId: string): Promise<string | null> => {
    try {
      const blob = base64ToBlob(base64Photo);
      const fileName = `funcionario_${funcionarioId}_${Date.now()}.jpg`;

      const { data, error } = await supabase.storage
        .from('fotos-funcionarios')
        .upload(fileName, blob, {
          contentType: 'image/jpeg',
          upsert: true
        });

      if (error) {
        console.error('Photo upload error:', error);
        return null;
      }

      // Get the public URL
      const { data: urlData } = supabase.storage
        .from('fotos-funcionarios')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (err) {
      console.error('Upload error:', err);
      return null;
    }
  };

  const updateFuncionario = async (updatedFuncionario: Funcionario) => {
    // Update local state first for immediate UI feedback
    setFuncionarios(prev => prev.map(s => s.id_func === updatedFuncionario.id_func ? updatedFuncionario : s));

    let photoUrl = updatedFuncionario.foto_func;

    // If photo is base64 (new photo), upload to storage
    if (photoUrl && photoUrl.startsWith('data:image')) {
      console.log('Uploading new photo to storage...');
      const uploadedUrl = await uploadPhoto(photoUrl, updatedFuncionario.id_func);
      if (uploadedUrl) {
        photoUrl = uploadedUrl;
        // Update local state with the new URL
        setFuncionarios(prev => prev.map(s =>
          s.id_func === updatedFuncionario.id_func
            ? { ...s, foto_func: uploadedUrl }
            : s
        ));
      } else {
        alert('Erro ao fazer upload da foto');
        return;
      }
    }

    // Persist to Supabase
    try {
      const { error } = await supabase
        .from('FUNCIONARIOS')
        .update({
          nome_func: updatedFuncionario.nome_func,
          rf: updatedFuncionario.rf,
          vc: updatedFuncionario.vc,
          categoria: updatedFuncionario.categoria,
          cargo: updatedFuncionario.cargo,
          funcao: updatedFuncionario.funcao,
          subfuncao: updatedFuncionario.subfuncao,
          qpe: updatedFuncionario.qpe,
          status: updatedFuncionario.status,
          foto_func: photoUrl
        })
        .eq('id_func', updatedFuncionario.id_func);

      if (error) {
        console.error('Error updating funcionario:', error);
        alert('Erro ao salvar alterações no banco de dados');
      } else {
        console.log('Funcionario updated successfully in database');
      }
    } catch (err) {
      console.error('Error saving to Supabase:', err);
      alert('Erro ao conectar com o servidor');
    }
  };

  const addOccurrence = (occurrence: Occurrence) => {
    setOccurrences(prev => [...prev, occurrence]);
  };

  const deleteOccurrence = (id: string) => {
    setOccurrences(prev => prev.filter(occ => occ.id !== id));
  };

  // Dummy functions for compatibility
  const dummyToggle = () => { };
  const dummySetUser = () => { };

  return (
    <HashRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
        <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto bg-white shadow-sm md:my-4 md:rounded-xl overflow-hidden relative">
          <Routes>
            <Route path="/" element={
              <ShiftSelection user={MOCK_USER} onToggleRole={dummyToggle} onSetUser={dummySetUser} testUsers={[]} />
            } />
            <Route path="/classes/:shift" element={
              <ClassSelection user={MOCK_USER} onToggleRole={dummyToggle} />
            } />
            <Route path="/carometro/:shift/:grade" element={
              <CarometroGallery officials={funcionarios} user={MOCK_USER} onToggleRole={dummyToggle} />
            } />
            <Route path="/funcionario/:id" element={
              <FuncionarioDetail officials={funcionarios} occurrences={occurrences} user={MOCK_USER} onToggleRole={dummyToggle} />
            } />
            <Route path="/edit-funcionario/:id" element={
              <FuncionarioEdit officials={funcionarios} onUpdate={updateFuncionario} user={MOCK_USER} onToggleRole={dummyToggle} />
            } />
            <Route path="/occurrences" element={
              <OccurrencesList officials={funcionarios} occurrences={occurrences} user={MOCK_USER} onToggleRole={dummyToggle} />
            } />
            <Route path="/occurrence/:id" element={
              <OccurrenceDetail officials={funcionarios} occurrences={occurrences} user={MOCK_USER} onDelete={deleteOccurrence} />
            } />
            <Route path="/add-occurrence/:funcionarioId" element={
              <OccurrenceAdd officials={funcionarios} onAdd={addOccurrence} user={MOCK_USER} />
            } />
            <Route path="/add-multi-occurrence" element={
              <OccurrenceAddMulti officials={funcionarios} onAdd={addOccurrence} user={MOCK_USER} />
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
