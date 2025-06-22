// app/lib/uploadImagem.ts
'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function uploadImagemEmpresa(empresaId: number, file: File) {
  const supabase = createServerActionClient({ cookies })

  const fileExt = file.name.split('.').pop()
  const fileName = `${empresaId}.${fileExt}`

  const { data, error } = await supabase.storage
    .from('empresas')
    .upload(fileName, file, {
      upsert: true,
      contentType: file.type,
    })

  if (error) throw error

  const { data: urlData } = supabase.storage.from('empresas').getPublicUrl(fileName)
  return urlData.publicUrl
}
