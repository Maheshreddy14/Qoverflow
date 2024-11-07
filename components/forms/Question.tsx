"use client"
import React, { useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
 
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { QuestionsSchema } from "@/lib/validations"
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { createQuestion } from '@/lib/actions/question.action';
import { useRouter, usePathname } from 'next/navigation';

interface Props{
  mongoUserId:string
}


const Question = ({mongoUserId}:Props) => {
  //const EditorApiKey=process.env.TINY_MCE_API_KEY ||'your tiny mce api key'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const type:any='create'
  const router=useRouter()
  const pathname=usePathname()
  const form = useForm<z.infer<typeof QuestionsSchema>>({
    resolver: zodResolver(QuestionsSchema),
    defaultValues: {
      title: "",
      explanation: "",
      tags: [],
    },
  })

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof QuestionsSchema>) {
    setIsSubmitting(true)
    try {
      await createQuestion({
        title:values.title,
        content:values.explanation,
        tags:values.tags,
        author:JSON.parse(mongoUserId),
        path:pathname
      })
      form.reset()
      router.push('/')
    } catch (error) {
      
    }
    finally{
      setIsSubmitting(false)
    }
  }
  function handleInputKey(e: React.KeyboardEvent<HTMLInputElement>, field: any) {
    if (e.key === 'Enter' && field.name === 'tags') {
      e.preventDefault();

      const tagInput = e.target as HTMLInputElement;
      const tagValue = tagInput.value.trim();

      if(tagValue !== '') {
        if(tagValue.length > 15) {
          return form.setError('tags', {
            type: 'required',
            message: 'Tag must be less than 15 characters.'
          })
        }

        if(!field.value.includes(tagValue as never)) {
          form.setValue('tags', [...field.value, tagValue]);
          tagInput.value = ''
          form.clearErrors('tags');
        }
      } else {
        form.trigger();
      }
    }
  }

  function handleTagRemove(tag: string, field: any) {
    const newtags = field.value.filter((t: string) => t !== tag)
    form.setValue('tags', newtags)
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col mt-2">
              <FormLabel className="paragraph-semibold text-dark400_light800">Question Title<span className="text-primary-500">*</span></FormLabel>
              <FormControl className="mt-3.5">
                <Input className="no-focus paragraph-regular background-light900_dark300" placeholder="" {...field} />
              </FormControl>
              
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="explanation"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col gap-3">
              <FormLabel className="paragraph-semibold text-dark400_light800">Explanation<span className="text-primary-500">*</span></FormLabel>
              <FormControl className="mt-3.5">
                <Editor
                  apiKey='yt720z6a8xu0moe635ce6xjqonk745ufirbizft3xybo0naw'
                  onBlur={field.onBlur}
                  onEditorChange={(content) => field.onChange(content)}
                  initialValue=''
                  init={{
                    plugins: [
                      // Core editing features
                      'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
                      'checklist', 'mediaembed', 'casechange', 'export', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown',
                    ],
                    toolbar: 'undo redo | codesample bold italic blocks fontfamily | fontsize underline strikethrough | link image media mergetags | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    tinycomments_mode: 'embedded',
                    tinycomments_author: 'Author name',
                    mergetags_list: [
                      { value: 'First.Name', title: 'First Name' },
                      { value: 'Email', title: 'Email' },
                    ],
                    //@ts-ignore
                    ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('See docs to implement AI Assistant')),
                  }}
                />
              </FormControl>
              <FormDescription>
                Explain your question here, Be specific so others can understand.
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem className="flex w-full flex-col">
              <FormLabel className="paragraph-semibold text-dark400_light800">Tags<span className="text-primary-500">*</span></FormLabel>
              <FormControl className="mt-3.5">
              <>
                <Input 
                disabled={type === 'Edit'}
                className="no-focus paragraph-regular background-light900_dark300 light-border-2 text-dark300_light700 min-h-[56px] border"
                placeholder="Add tags..."
                onKeyDown={(e) => handleInputKey(e, field)}
                />
                
                {field.value.length > 0 && (
                  <div className="flex-start mt-2.5 gap-2.5">
                    {field.value.map((tag: any) => (
                      <Badge key={tag} className="subtle-medium background-light800_dark300 text-light400_light500 flex items-center justify-center gap-2 rounded-md border-none px-4 py-2 capitalize" 
                      onClick={() => type !== 'Edit' ? handleTagRemove(tag, field) : () => {}}>
                        {tag}
                        {type !== 'Edit' && (<Image 
                          src="/assets/icons/close.svg"
                          alt="Close icon"
                          width={12}
                          height={12}
                          className="cursor-pointer object-contain invert-0 dark:invert"
                        />)}
                      </Badge>
                    ))}
                  </div>
                )}
                </>
              </FormControl>
              <FormDescription>
                Add upto three tags to describe your question about
              </FormDescription>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />

        <Button className="primary-gradient w-fit !text-light-900" type="submit">
          {
            isSubmitting ?(
              <>
              {type==='edit'?'Editing...':'Posting'}
              </>
            ):
            (
            <>
            {type==='edit'?'Edit the Question':'Ask a Question'}
            </>
            )
          }
        </Button>
      </form>
    </Form>
  )
}

export default Question