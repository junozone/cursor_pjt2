import { render, screen, fireEvent } from '@testing-library/react'
import WorkoutModal from '@/components/workout-modal'

describe('WorkoutModal', () => {
  const mockOnClose = jest.fn()
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders modal when isOpen is true', () => {
    render(
      <WorkoutModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    expect(screen.getByText('今日の頑張りを記録')).toBeInTheDocument()
    expect(screen.getByText('運動の種類')).toBeInTheDocument()
    expect(screen.getByText('時間')).toBeInTheDocument()
  })

  it('calls onSubmit with selected exercise and time', () => {
    render(
      <WorkoutModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    // 運動を選択
    fireEvent.click(screen.getByText('ランニング'))
    
    // 時間を選択
    fireEvent.click(screen.getByText('30分'))
    
    // 記録ボタンをクリック
    fireEvent.click(screen.getByText('記録する'))

    expect(mockOnSubmit).toHaveBeenCalledWith(1, 30)
  })

  it('disables submit button when no exercise or time is selected', () => {
    render(
      <WorkoutModal
        isOpen={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    )

    const submitButton = screen.getByText('記録する')
    expect(submitButton).toBeDisabled()
  })
}) 