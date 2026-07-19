import CustomTextarea from "@/components/custom/textarea";


export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <CustomTextarea
          label="Describe the problem in one sentence, without using the words _platform_, _solution_, _seamless_, or _AI_."
          instruction="Remember this is not about *solution*"
        />
      </main>
    </div>
  );
}
