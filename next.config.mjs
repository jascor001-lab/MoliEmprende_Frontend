/** @type {import('next').NextConfig} */
const nextConfig = {
  // La carpeta ".next" quedó inservible por corrupción del índice NTFS: Windows
  // no la borra ni deja crear subcarpetas dentro. Se puede volver al valor por
  // defecto una vez que un chkdsk repare el disco.
  distDir: ".next-build",
};

export default nextConfig;
