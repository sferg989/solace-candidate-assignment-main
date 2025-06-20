import '@testing-library/jest-dom'
import { render, screen, waitFor } from '@testing-library/react'
import Home from './page'

global.fetch = jest.fn()

describe('Home Component', () => {
  beforeEach(() => {

    jest.clearAllMocks()
    

    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce({
        data: [
          {
            firstName: 'John',
            lastName: 'Doe',
            city: 'New York',
            degree: 'Masters',
            specialties: ['Technology'],
            yearsOfExperience: '5',
            phoneNumber: '123-456-7890'
          }
        ]
      })
    })
  })

  it('renders the main heading', async () => {
    render(<Home />)
    
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('Solace Advocates')
    

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/advocates')
    })
  })

  it('renders search functionality', async () => {
    render(<Home />)
    
    const searchInput = screen.getByRole('textbox')
    const resetButton = screen.getByRole('button', { name: /reset search/i })
    
    expect(searchInput).toBeInTheDocument()
    expect(resetButton).toBeInTheDocument()
    

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/advocates')
    })
  })

  it('calls fetch API on component mount', async () => {
    render(<Home />)
    

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/advocates')
      expect(global.fetch).toHaveBeenCalledTimes(1)
    })
  })
}) 