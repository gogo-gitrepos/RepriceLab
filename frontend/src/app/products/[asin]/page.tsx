'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { apiClient, PricingPreview } from '../../../lib/api';
import { useI18n } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ProductDetail() {
    const { t } = useI18n();
    const params = useParams();
    const asin = params.asin as string;
    const [preview, setPreview] = useState<PricingPreview | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        apiClient.getPreview(asin)
            .then(setPreview)
            .catch(e => setError(e.message));
    }, [asin]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">
                  {t('productDetail.title', { asin })}
                </h2>
                <Button variant="link" asChild>
                  <a href="/products">{t('products.back')}</a>
                </Button>
            </div>
            
            {error && (
              <Card className="border-destructive bg-destructive/10">
                <CardContent className="pt-6">
                  <p className="text-destructive">{error}</p>
                </CardContent>
              </Card>
            )}
            
            {!preview && !error && (
              <div className="text-center py-8">
                <p className="text-muted-foreground">{t('products.loading')}</p>
              </div>
            )}
            
            {preview && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader>
                          <CardTitle>{t('productDetail.pricePreview')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('productDetail.currentPrice')}</span>
                                <span className="font-semibold">{preview.current_price.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('productDetail.competitorMin')}</span>
                                <span className="font-semibold">
                                  {preview.competitor_min !== undefined && preview.competitor_min !== null ? preview.competitor_min.toFixed(2) : '-'}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('productDetail.minMax')}</span>
                                <span className="font-semibold">
                                  {preview.min_price.toFixed(2)} / {preview.max_price.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">{t('productDetail.suggested')}</span>
                                <span className="font-bold text-primary">{preview.suggested_price.toFixed(2)}</span>
                            </div>
                          </div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader>
                          <CardTitle>{t('productDetail.notes')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground">
                            {t('productDetail.demoNote')}
                          </p>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}