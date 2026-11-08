import dotenv from 'dotenv';
dotenv.config();
import multer from 'multer';
import { createClient } from '@supabase/supabase-js';

const TU_SUPABASE_URL = process.env.TU_SUPABASE_URL || "https://cvdxxfmzerqedmxxfsrs.supabase.co";
const TU_SUPABASE_ANON_KEY = process.env.TU_SUPABASE_ANON_KEY || 'sb_publishable_rpBA493YCHwRcU6Z7ZKhBA_Epgp6JLt';

const supabase = createClient(TU_SUPABASE_URL, TU_SUPABASE_ANON_KEY)
const SupabaseCustomStorage = {
    _handleFile: async function (req, file, cb) {
        try {
            // 🔴 CORRECCIÓN: Sanitizar el nombre antes de subirlo para que coincida con la BD
            const nombreArchivo = file.originalname
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-zA-Z0-9.\-_]/g, "-")
                .replace(/-+/g, "-");

            const bucketName = 'files'; // Tu bucket público en Supabase

            // Subir el flujo de datos (stream) directamente a Supabase
            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(nombreArchivo, file.stream, {
                    contentType: file.mimetype,
                    duplex: 'half' // Requerido para manejar streams en entornos Node modernos
                });

            if (error) return cb(error), console.log('JD ERROR:' + error);
            
            // Obtener la URL pública inmediatamente
            const { data: publicUrlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(nombreArchivo);

            console.log(publicUrlData);
            // Retornamos las variables adjuntándolas al objeto 'file' de Multer
            cb(null, {
                path: publicUrlData.publicUrl,
                filename: nombreArchivo
            });
        } catch (err) {
            cb(err);
            console.log('ERROR: ' + err);
        }
    },
    _removeFile: function (req, file, cb) {
        cb(null);
    }
};

// Toda la configuración encapsulada en el objeto upload de Multer
export const upload = multer({ storage: SupabaseCustomStorage });