import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Taskbar from './Taskbar' // Adjust path as necessary
import { raised, sunken } from '../utils/win95' // To check styles

// Mock the image import
vi.mock('../assets/win95-logo.png', () => ({
  default: 'win95-logo-mock.png', // Provide a mock path or value
}))

// Mock StartMenu to simplify Taskbar tests if needed, or allow full integration testing
// For now, let's test the integrated behavior.
// vi.mock('./StartMenu', () => ({
//   default: vi.fn(({ isOpen, onClose }) =>
//     isOpen ? <div data-testid="start-menu-mock">Start Menu Mock <button onClick={onClose}>Close</button></div> : null
//   ),
// }));

describe('Taskbar Component', () => {
  // Initial props for Taskbar - can be customized per test
  const defaultTaskbarProps = {
    windowTitle: 'Main Window',
    minimized: false,
    onToggle: vi.fn(),
  }

  beforeEach(() => {
    // Reset mocks if they are stateful or called multiple times
    vi.clearAllMocks()
  })

  afterEach(() => {
    cleanup() // Unmounts React trees that were mounted with render.
  })

  describe('Start Menu Functionality', () => {
    it('should open the Start Menu when Start button is clicked', () => {
      render(<Taskbar {...defaultTaskbarProps} />)
      // The Start button's accessible name should be "Start" due to its text content.
      // Tooltip for Start button is "Click here to begin."
      const startButton = screen.getByRole('button', { name: /Start/i })
      expect(startButton).not.toBeNull()
      fireEvent.click(startButton)
      expect(screen.getByText('Programs')).not.toBeNull()
    })

    it('should close the Start Menu when Start button is clicked again', async () => {
      render(<Taskbar {...defaultTaskbarProps} />)
      const startButton = screen.getByRole('button', { name: /Start/i })
      expect(startButton).not.toBeNull()

      // Open
      fireEvent.click(startButton)
      expect(screen.getByText('Programs')).not.toBeNull()

      // Close
      fireEvent.click(startButton)
      await waitFor(() => {
        expect(screen.queryByText('Programs')).toBeNull()
      })
    })

    it('should close the Start Menu when clicking outside of it', async () => {
      render(
        <div>
          <div data-testid="outside-element">Click Outside Here</div>
          <Taskbar {...defaultTaskbarProps} />
        </div>
      )
      const startButton = screen.getByRole('button', { name: /Start/i })
      expect(startButton).not.toBeNull()
      const outsideElement = screen.getByTestId('outside-element')

      // Open Start Menu
      fireEvent.click(startButton)
      expect(screen.getByText('Programs')).not.toBeNull()

      // Click outside
      fireEvent.mouseDown(outsideElement)

      await waitFor(() => {
        expect(screen.queryByText('Programs')).toBeNull()
      })
    })
  })

  describe('Taskbar Buttons Functionality', () => {
    it('should mark a taskbar button as active (sunken) and others as inactive (raised) on click', () => {
      render(<Taskbar {...defaultTaskbarProps} />)

      // For app buttons where tooltip and button text might be the same,
      // we need to be careful. We can select the button based on its role and the visible text content.
      // The accessible name might include the icon text AND the visible text.
      const myComputerButton = screen.getByRole('button', {
        name: /My Computer/i,
      })
      const recycleBinButton = screen.getByRole('button', {
        name: /Recycle Bin/i,
      })

      expect(myComputerButton).not.toBeNull()
      expect(recycleBinButton).not.toBeNull()

      // Initial state
      expect(myComputerButton.className).toContain(sunken.trim())
      expect(recycleBinButton.className).toContain(raised.trim())

      // Click Recycle Bin button
      fireEvent.click(recycleBinButton)

      // New state
      expect(recycleBinButton.className).toContain(sunken.trim())
      expect(myComputerButton.className).toContain(raised.trim())

      // Click My Computer button again
      fireEvent.click(myComputerButton)
      expect(myComputerButton.className).toContain(sunken.trim())
      expect(recycleBinButton.className).toContain(raised.trim())
    })
  })
})
