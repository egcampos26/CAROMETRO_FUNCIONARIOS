
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
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

import { useAuth } from './AuthContext';
import Login from './pages/Login';
import PersonalData from './pages/PersonalData';
import PersonalDataEdit from './pages/PersonalDataEdit';
import { ProtectedRoute } from './components/ProtectedRoute';

const App: React.FC = () => {
  const { user, loading } = useAuth();
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
          foto_func: photoUrl,
          cpf_func: updatedFuncionario.cpf_func,
          rg_func: updatedFuncionario.rg_func,
          data_nascimento_func: updatedFuncionario.data_nascimento_func,
          cep_func: updatedFuncionario.cep_func,
          logradouro_func: updatedFuncionario.logradouro_func,
          "n°_func": updatedFuncionario["n°_func"],
          compl_func: updatedFuncionario.compl_func,
          bairro_func: updatedFuncionario.bairro_func,
          cidade_func: updatedFuncionario.cidade_func,
          estado_func: updatedFuncionario.estado_func
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

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3b5998] mx-auto mb-4"></div>
          <h2 className="text-lg font-bold text-gray-800 mb-2">Carregando Carômetro</h2>
          <p className="text-sm text-gray-600">Conectando ao servidor e autenticando...</p>
          <p className="text-xs text-gray-400 mt-4">
            Se continuar carregando por muito tempo, verifique sua conexão ou acesse <a href="/debug.html" className="text-[#3b5998] underline" target="_blank">diagnóstico</a>
          </p>
        </div>
      </div>
    );
  }

  // Map session user to legacy AuthUser type for components
  const legacyUser: AuthUser | null = user ? {
    id: user.id_func,
    name: user.nome_func,
    email: user.email,
    role: user.role as 'Admin' | 'Teacher' | 'Funcionario'
  } : null;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col w-full overflow-x-hidden">
        <div className="flex-1 flex flex-col w-full max-w-7xl mx-auto bg-white shadow-sm md:my-4 md:rounded-xl overflow-hidden relative">
          <Routes>
            <Route path="/login" element={
              user ? <Navigate to="/" replace /> : <Login />
            } />

            <Route path="/" element={
              <ProtectedRoute>
                <ShiftSelection user={legacyUser!} onToggleRole={dummyToggle} onSetUser={dummySetUser} testUsers={[]} />
              </ProtectedRoute>
            } />

            <Route path="/classes/:shift" element={
              <ProtectedRoute>
                <ClassSelection user={legacyUser!} onToggleRole={dummyToggle} />
              </ProtectedRoute>
            } />

            <Route path="/carometro/:shift/:grade" element={
              <ProtectedRoute>
                <CarometroGallery officials={funcionarios} user={legacyUser!} onToggleRole={dummyToggle} />
              </ProtectedRoute>
            } />

            <Route path="/funcionario/:id" element={
              <ProtectedRoute>
                <FuncionarioDetail officials={funcionarios} occurrences={occurrences} user={legacyUser!} onToggleRole={dummyToggle} />
              </ProtectedRoute>
            } />

            <Route path="/edit-funcionario/:id" element={
              <ProtectedRoute>
                <FuncionarioEdit officials={funcionarios} onUpdate={updateFuncionario} user={legacyUser!} onToggleRole={dummyToggle} />
              </ProtectedRoute>
            } />

            <Route path="/personal-data/:id" element={
              <ProtectedRoute>
                <PersonalData officials={funcionarios} user={legacyUser!} onToggleRole={dummyToggle} />
              </ProtectedRoute>
            } />

            <Route path="/personal-data/:id/edit" element={
              <ProtectedRoute>
                <PersonalDataEdit officials={funcionarios} onUpdate={updateFuncionario} user={legacyUser!} onToggleRole={dummyToggle} />
              </ProtectedRoute>
            } />

            <Route path="/occurrences" element={
              <ProtectedRoute>
                <OccurrencesList officials={funcionarios} occurrences={occurrences} user={legacyUser!} onToggleRole={dummyToggle} />
              </ProtectedRoute>
            } />

            <Route path="/occurrence/:id" element={
              <ProtectedRoute>
                <OccurrenceDetail officials={funcionarios} occurrences={occurrences} user={legacyUser!} onDelete={deleteOccurrence} />
              </ProtectedRoute>
            } />

            <Route path="/add-occurrence/:funcionarioId" element={
              <ProtectedRoute>
                <OccurrenceAdd officials={funcionarios} onAdd={addOccurrence} user={legacyUser!} />
              </ProtectedRoute>
            } />

            <Route path="/add-multi-occurrence" element={
              <ProtectedRoute>
                <OccurrenceAddMulti officials={funcionarios} onAdd={addOccurrence} user={legacyUser!} />
              </ProtectedRoute>
            } />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
};

export default App;
