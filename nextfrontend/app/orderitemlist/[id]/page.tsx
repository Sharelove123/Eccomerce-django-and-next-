'use client'

import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import apiService from '@/app/services/apiService';
import { useParams } from 'next/navigation';
import { OrderItemList } from '@/app/utils/types';


function OrderItemListPage() {
    const { id } = useParams();
    const [orderItemList, setOrderItemList] = React.useState<OrderItemList[] | null>(null);


    const StyledTableCell = styled(TableCell)(({ theme }) => ({
        [`&.${tableCellClasses.head}`]: {
          backgroundColor: theme.palette.common.black,
          color: theme.palette.common.white,
        },
        [`&.${tableCellClasses.body}`]: {
          fontSize: 14,
        },
      }));
      
      const StyledTableRow = styled(TableRow)(({ theme }) => ({
        '&:nth-of-type(odd)': {
          backgroundColor: theme.palette.action.hover,
        },
        // hide last border
        '&:last-child td, &:last-child th': {
          border: 0,
        },
      }));

      
    React.useEffect(() => {
        if (id) {
            const fetchProduct = async () => {
                try {
                    const response = await apiService.get(`/api/cart/listorderitem/?orderID=${id}`);
                    setOrderItemList(response);
                } catch (error) {
                    console.error('Error fetching product:', error);
                }
            };

            fetchProduct();
        }
    }, [id]);

    if (!orderItemList) {
        return <div>Loading...</div>;
    }





    return (
        <div className='mt-10 pt-10'>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 400 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>OrderItemId</StyledTableCell>
                            <StyledTableCell>Title</StyledTableCell>
                            <StyledTableCell>Total Price</StyledTableCell>
                            <StyledTableCell>Quantity</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orderItemList.map((orderItem:OrderItemList) => (
                            <StyledTableRow key={orderItem.id}>
                                <StyledTableCell component="th" scope="row">
                                    {orderItem.id}
                                </StyledTableCell>
                                <StyledTableCell>{orderItem.product.title}</StyledTableCell>
                                <StyledTableCell>{orderItem.total_price.toString()}</StyledTableCell>
                                <StyledTableCell>{orderItem.quantity.toString()}</StyledTableCell>
                                
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

export default OrderItemListPage