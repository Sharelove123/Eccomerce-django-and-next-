import VendorProductForm from '@/app/components/vendor/vendorProductForm';


export default async function EditVendorProductPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return <VendorProductForm mode="edit" productId={id} />;
}
