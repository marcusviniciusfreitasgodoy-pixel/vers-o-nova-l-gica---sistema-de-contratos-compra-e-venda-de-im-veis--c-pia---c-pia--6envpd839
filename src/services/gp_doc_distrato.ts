import pb from '@/lib/pocketbase/client'

export const getDistratos = () => pb.collection('gp_doc_distrato').getFullList()

export const getDistrato = (id: string) => pb.collection('gp_doc_distrato').getOne(id)

export const createDistrato = (data: any) => pb.collection('gp_doc_distrato').create(data)

export const updateDistrato = (id: string, data: any) =>
  pb.collection('gp_doc_distrato').update(id, data)

export const deleteDistrato = (id: string) => pb.collection('gp_doc_distrato').delete(id)
