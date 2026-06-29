import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { driverStore } from '@/store/data';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Upload, Car, IdCard, Send, Pencil, CheckCircle } from 'lucide-react';

export default function DriverVerifyPage() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get('mode') === 'edit';

  const [idCard, setIdCard] = useState(user?.idCard || '');
  const [carModel, setCarModel] = useState(user?.carModel || '');
  const [carPlate, setCarPlate] = useState(user?.carPlate || '');
  const [carColor, setCarColor] = useState(user?.carColor || '');
  const [idCardImage, setIdCardImage] = useState<string | null>(null);
  const [dlImage, setDlImage] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!user) { navigate('/login'); return null; }

  // 已认证 & 非编辑模式 → 显示只读信息 + 编辑按钮
  if (user.driverVerified && !isEditMode) {
    return (
      <div className="max-w-md mx-auto text-center py-12 space-y-5 animate-fadeInUp">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center mx-auto border border-emerald-100">
          <CheckCircle className="w-10 h-10 text-emerald-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-800">认证已完成</h2>
        <p className="text-slate-400 text-sm">您已经是认证车主，可以发布行程了</p>

        <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 text-left space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 border-b border-slate-50 pb-2">
            <Car className="w-4 h-4 text-indigo-500" /> 车辆信息
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 mb-0.5">车型</div>
              <div className="font-semibold text-slate-700 text-sm">{user.carModel}</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <div className="text-[11px] text-slate-400 mb-0.5">车牌号</div>
              <div className="font-semibold text-slate-700 text-sm">{user.carPlate}</div>
            </div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 mb-0.5">车身颜色</div>
            <div className="font-semibold text-slate-700 text-sm">{user.carColor}</div>
          </div>
          <div className="bg-slate-50 rounded-xl p-3">
            <div className="text-[11px] text-slate-400 mb-0.5">身份证号</div>
            <div className="font-semibold text-slate-700 text-sm">{user.idCard}</div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/profile" className="flex-1">
            <Button variant="outline" className="w-full rounded-xl h-11 border-slate-200">
              返回个人中心
            </Button>
          </Link>
          <Link to="/driver-verify?mode=edit" className="flex-1">
            <Button className="w-full rounded-xl h-11 bg-indigo-600 hover:bg-indigo-700">
              <Pencil className="w-4 h-4 mr-1.5" /> 修改车辆信息
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); setError('');
    if (!carModel || !carPlate || !carColor) { setError('请填写完整车辆信息'); return; }
    if (!user.driverVerified && (!idCard || idCard.length !== 18)) { setError('请输入正确的18位身份证号'); return; }
    setSubmitting(true);
    setTimeout(() => {
      if (!user.driverVerified) {
        driverStore.verify(user.id, { idCard, carModel, carPlate, carColor });
      } else {
        driverStore.updateVehicle(user.id, { carModel, carPlate, carColor });
      }
      refresh();
      setSubmitting(false);
      navigate(user.driverVerified ? '/profile' : '/post', { replace: true });
    }, 600);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setFn: (v: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setFn(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const isVerifiedEdit = user.driverVerified && isEditMode;

  return (
    <div className="max-w-xl mx-auto space-y-5 animate-fadeInUp">
      <Link to={isVerifiedEdit ? '/driver-verify' : '/'} className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600">
        <ArrowLeft className="w-4 h-4" /> {isVerifiedEdit ? '返回详情' : '返回'}
      </Link>

      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center border border-amber-100">
          {isVerifiedEdit ? <Pencil className="w-5 h-5 text-indigo-500" /> : <Car className="w-5 h-5 text-amber-500" />}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isVerifiedEdit ? '修改车辆信息' : user.driverVerified ? '车主认证' : '车主认证'}
          </h1>
          <p className="text-sm text-slate-400">
            {isVerifiedEdit ? '更新您的车辆信息' : '完成实名认证后即可发布行程'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-4">
        {/* 实名信息（仅首次认证显示） */}
        {!user.driverVerified && (
          <>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-slate-500 text-xs font-medium">
                <IdCard className="w-4 h-4 text-slate-300" /> 身份证号
              </label>
              <input
                type="text"
                placeholder="请输入18位身份证号"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value.slice(0, 18))}
                maxLength={18}
                className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-slate-500 text-xs font-medium">身份证正面照片</label>
              <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
                {idCardImage ? (
                  <img src={idCardImage} alt="ID Card" className="h-full object-contain rounded-xl" />
                ) : (
                  <div className="text-center text-slate-400">
                    <Upload className="w-6 h-6 mx-auto mb-1.5" />
                    <span className="text-xs">点击上传身份证照片</span>
                  </div>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setIdCardImage)} />
              </label>
            </div>

            <div className="h-px bg-slate-100" />
          </>
        )}

        {/* 车辆信息 */}
        <div className="flex items-center gap-2">
          <Car className="w-4 h-4 text-slate-400" />
          <span className="font-semibold text-slate-700 text-sm uppercase tracking-wide">车辆信息</span>
        </div>

        <div className="space-y-1.5">
          <label className="text-slate-500 text-xs font-medium">车型</label>
          <input
            type="text"
            placeholder="例如：特斯拉 Model 3"
            value={carModel}
            onChange={(e) => setCarModel(e.target.value)}
            className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-slate-500 text-xs font-medium">车牌号</label>
            <input
              type="text"
              placeholder="例如：沪A12345"
              value={carPlate}
              onChange={(e) => setCarPlate(e.target.value.toUpperCase())}
              className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-slate-500 text-xs font-medium">车身颜色</label>
            <input
              type="text"
              placeholder="例如：白色"
              value={carColor}
              onChange={(e) => setCarColor(e.target.value)}
              className="w-full h-11 rounded-xl border border-slate-200 px-4 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 outline-none transition-all"
            />
          </div>
        </div>

        {/* 行驶证照片（仅首次认证显示） */}
        {!user.driverVerified && (
          <div className="space-y-1.5">
            <label className="text-slate-500 text-xs font-medium">行驶证照片</label>
            <label className="flex flex-col items-center justify-center h-28 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/30 transition-all">
              {dlImage ? (
                <img src={dlImage} alt="Driving License" className="h-full object-contain rounded-xl" />
              ) : (
                <div className="text-center text-slate-400">
                  <Upload className="w-6 h-6 mx-auto mb-1.5" />
                  <span className="text-xs">点击上传行驶证照片</span>
                </div>
              )}
              <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, setDlImage)} />
            </label>
          </div>
        )}

        {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-3 py-2.5">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white text-base font-semibold shadow-md shadow-indigo-500/25 transition-all disabled:opacity-60"
        >
          <span className="inline-flex items-center justify-center gap-2">
            {submitting ? (
              <>处理中...</>
            ) : isVerifiedEdit ? (
              <><Send className="w-4 h-4" /> 保存修改</>
            ) : (
              <><Send className="w-4 h-4" /> 提交认证</>
            )}
          </span>
        </button>

        <p className="text-xs text-slate-400 text-center">
          {isVerifiedEdit ? '保存后车辆信息将立即更新' : '提交后即表示您同意平台的实名认证规则，我们承诺保护您的隐私安全'}
        </p>
      </form>
    </div>
  );
}
