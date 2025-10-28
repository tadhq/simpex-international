import B2BText from './B2BText';

export default function B2BFloatingIndicator() {
  return (
    <div className="fixed top-1/2 left-0 z-10">
      <div className="[text-orientation:mixed] [writing-mode:vertical-lr] bg-primary-500 text-white sm:px-0.5 py-2 leading-[1] rounded-tr-md rounded-br-md">
        <B2BText />
      </div>
    </div>
  );
}
