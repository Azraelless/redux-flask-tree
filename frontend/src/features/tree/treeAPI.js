import axios from 'axios'

export async function fetchChildren(id) {
  const response = await axios.get('http://localhost:5000', { params: { id } })
  return { data: response.data, parent: id }
}
