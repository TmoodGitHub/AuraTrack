import { forwardRef, type InputHTMLAttributes, type ForwardedRef } from 'react';

type FloatingInputProps = {
  label: string;
  id: string;
  error?: string; // error is optional and a string if it exists
} & InputHTMLAttributes<HTMLInputElement>; // This allows us to pass other props to the input

const FloatingInput = (
  { label, id, error, ...rest }: FloatingInputProps,
  ref: ForwardedRef<HTMLInputElement>
) => {
  const errorId = `${id}-error`; // Unique id for error message, useful for aria-describedby

  return (
    <div className='relative z-0 w-full group'>
      <input
        id={id}
        name={id}
        placeholder=' '
        aria-invalid={!!error} // If there is an error, aria-invalid will be true
        aria-describedby={error ? errorId : undefined} // Associates error message with the input
        className={`block px-2.5 pb-2.5 pt-4 w-full text-sm bg-transparent rounded-lg border appearance-none focus:outline-none focus:ring-0 peer
          ${
            error
              ? 'border-red-500 text-red-900 focus:border-red-600'
              : 'border-gray-300 text-gray-900 focus:border-blue-600'
          }
        `}
        ref={ref}
        {...rest} // Spread other props like {...register()}
      />

      <label
        htmlFor={id}
        className={`absolute text-sm duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-1 left-2
          ${error ? 'text-red-500' : 'text-gray-500'}
          peer-placeholder-shown:translate-y-2.5
          peer-placeholder-shown:scale-100
          peer-placeholder-shown:top-4
          peer-focus:top-2
          peer-focus:scale-75
          peer-focus:-translate-y-4
        `}
      >
        {label}
      </label>

      {/* Display error message if it exists */}
      {error && (
        <p id={errorId} className='mt-1 text-sm text-red-600'>
          {error}
        </p>
      )}
    </div>
  );
};

export default forwardRef(FloatingInput);
