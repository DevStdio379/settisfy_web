import { components, ControlProps } from 'react-select'

export interface OptionType {
  value: string
  label: string
  image: string
}

const ControlComponent = components.Control as React.FC<ControlProps<OptionType>>

export const CustomControl: React.FC<ControlProps<OptionType>> = ({ children, ...props }) => {
  const selected = props.getValue()[0] as OptionType

  return (
    <ControlComponent {...props}>
      {selected?.image && (
        <img
          src={selected.image}
          className="img-fluid rounded-circle ms-2"
          style={{ width: '20px', height: '20px' }}
          alt={selected.label}
        />
      )}
      {children}
    </ControlComponent>
  )
}
