// Resource: https://docs.uploadthing.com/api-reference/react#generatereacthelpers
// Copy paste (be careful with imports)

import { OurFileRouter } from '@/app/api/uploadthing/core';
import { generateReactHelpers } from '@uploadthing/react/hooks';


export const { useUploadThing, uploadFiles } =
  generateReactHelpers<OurFileRouter>();
